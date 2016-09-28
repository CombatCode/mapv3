defmodule Longpoll.Dbworker do

  use GenServer
  use Amnesia

  alias Longpoll.CacheDatabase, as: CD

  @update_time 5 * 60 * 1000

  def start_link(opts \\ []) do
      GenServer.start_link(__MODULE__, :ok, opts)
  end

  def get_objects() do
    GenServer.call(__MODULE__, :get_objects)
  end

  def cache_rights(user, devices, right) do
    GenServer.cast(__MODULE__, {:cache_rights, user, devices, right})
  end

  def register_user_on(user, devices) do
    GenServer.call(__MODULE__, {:register_user_on, user, devices})
  end

  def get_statuses(ids) do
    GenServer.call(__MODULE__, {:get_statuses, ids})
  end

  def check_if_user_exists(user) do
    GenServer.call(__MODULE__, {:check_if_user_exists, user})
  end

#  def put_status_to_cache(id, system_object) do
#    GenServer.cast(__MODULE__, {:put_status_to_cache, id, system_object})
#  end

  def init(:ok) do
      Amnesia.start
      CD.create(ram: [node])
      Process.send(self, :update, [])
      {:ok, %{}}
  end

  def handle_call(:get_objects, _from, state) do
      devices = Amnesia.transaction do
          CD.GisObjects.read(1)
      end
      {:reply, devices, state}
  end

  def get_statuses_from_cache(ids) do
    get_statuses_from_cache(ids, %{})
  end

  def get_statuses_from_cache([h|t], aggr) do
    status = Amnesia.transaction do
      CD.GisStatuses.read(h)
    end
    case status do
      %CD.GisStatuses{id: id, status_object: status_object} ->
        get_statuses_from_cache(t, Map.put(aggr, h, status_object))
      nil -> get_statuses_from_cache(t, aggr)
    end
  end
  def get_statuses_from_cache([], aggr) do
    aggr
  end

  def handle_call({:get_statuses, ids}, _from, state) do
    statuses = get_statuses_from_cache(ids)
    {:reply, statuses, state}
  end

  def handle_call({:register_user_on, user, devices}, _from, state) do
    # it's commentes in the reason of movie checking to SQL 'IN'
#    user_rights = Amnesia.transaction do
#      CD.UserRights.read(user)
#    end
    register = MapSet.new(devices)  # , fn x -> Integer.to_string(Map.get(x, "Id")) <> Map.get(x, "Type") end)
    Amnesia.transaction do
      %CD.UserRegister{username: user, register: register} |> CD.UserRegister.write
    end
    {:reply, :ok, state}
  end

  def handle_info(:update, state) do
    gis_elements =  Gis.Queries.all_objects()
    elements = for x <- gis_elements, do: %{"Id" => x.id, "Type" => x.gisobjecttypes.ot_name}
    Amnesia.transaction do
     %CD.GisObjects{id: 1, gis_objects: elements} |> CD.GisObjects.write
    end
    Process.send_after(self, :update, @update_time)
    {:noreply, state}
  end

  def handle_info({:put_status_to_cache, id, system_object}, state) do
    Amnesia.transaction do
      %CD.GisStatuses{id: id, status_object: system_object} |> CD.GisStatuses.write
    end
    {:noreply, state}
  end

  def handle_info({:brodcast_to_users_by_device, device, status}, state) do
    gis_register = Amnesia.transaction! do
      CD.GisRegister.read(device)
    end
    if gis_register != nil do
#      Gis.Endpoint.broadcast("polling:mm", "change", status)
      users = Map.get(gis_register, :users)
      get_all_rights(users, %{device => status})
    end
    {:noreply, state}
  end

  def handle_info({:register_user_to_device, user, device}, state) do
    Amnesia.transaction do
      gis_register = CD.GisRegister.read(device)
      new_users = MapSet.new([user])
      if gis_register != nil do
        new_users = MapSet.union(new_users, Map.get(gis_register, :users))
      end
      %CD.GisRegister{id: device, users: new_users} |> CD.GisRegister.write
    end
    {:noreply, state}
  end

  def handle_info(_, state) do
    {:noreply, state}
  end

  def handle_cast({:cache_rights, user, devices, right}, state) do
    Amnesia.transaction do
      CD.UserRights.add_rights(user, devices, right)
    end
    {:noreply, state}
  end

  def handle_call({:check_if_user_exists, user}, _from, state) do
    cache_user = Amnesia.transaction do
      CD.UserRights.read(user)
    end
    case cache_user.username do
      ^user -> {:reply, :ok, state}
      nil -> {:reply, :not_exists, state}
    end
  end

  def get_all_rights(users, status) do
    Enum.map(users, &Task.start_link(fn -> Gis.Endpoint.broadcast("polling:" <> &1, "change", status) end))
  end

end