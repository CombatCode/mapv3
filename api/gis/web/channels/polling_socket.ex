defmodule Gis.PollingChannel do
  use Gis.Web, :channel
  use Amnesia
  require Logger

  alias Longpoll.Worker

  def join("polling:" <> user_id, _payload, socket) do
    if user_id != "" do
      send self, :after_join
      {:ok, assign(socket, :user_id, user_id)}
    else
      {:ok, socket}
    end
  end

  def attach_to_polling(user, devices) do
    Enum.map(devices, &Process.send(Longpoll.Dbworker, {:register_user_to_device, user, &1}, []))
    Longpoll.Dbworker.get_statuses(devices)
  end


  def handle_in("register", %{"user" => user, "objects" => objects}, socket)  do
    user_in_cache = Longpoll.Dbworker.check_if_user_exists(user)
    if is_list(objects) and user_in_cache == :ok do
      #register user on
      status_register = Longpoll.Dbworker.register_user_on(socket.assigns.user_id, objects)
      polled_objects = case status_register do
        :ok -> attach_to_polling(user, objects)
        _ -> %{}
      end
    else
      IO.puts("NO! NOT AGAIN")
    end
    {:reply, {:ok, %{objects: polled_objects}}, socket}
  end

  def handle_info(:after_join, socket) do
#    user = socket.assigns.user_id
#    devices = Longpoll.Dbworker.get_objects()
#    # Chunk devices into groups per 1000 objects
#    devices_chunk = Enum.chunk(devices.gis_objects, 1000, 1000, [])
#    right_devices = get_all_rights(user, devices_chunk, "ObjView")
#    Longpoll.Dbworker.cache_rights(user, right_devices, "ObjView")
     process = after_join_processing(socket)
#      Enum.reduce([], fn(x, acc) -> x ++ acc end)
#    IO.inspect("Dziala")
    Process.list |> Enum.map(&:erlang.garbage_collect/1)
    push socket, "register:start", %{status: "get_ready_for_rumble"}
    {:noreply, socket}
  end

  def handle_info(_, socket) do
    {:noreply, socket}
  end

  def after_join_processing(socket) do
    user = socket.assigns.user_id
#    IO.inspect(user)
    devices = Longpoll.Dbworker.get_objects().gis_objects
    # Chunk devices into groups per 1000 objects
#    devices_chunk = Enum.chunk(devices.gis_objects, 1000, 1000, [])
    right_devices = get_all_rights(user, devices, "ObjView")
    Longpoll.Dbworker.cache_rights(user, right_devices, "ObjView")
#    IO.inspect(right_devices)

  end

  def get_all_rights(user, devices, right) do
    get_all_rights(user, devices, right, [])
#    devices |>
#      Enum.map(fn(x) -> Longpoll.Rights.get_rights(user, x, right) end) |>
#      Enum.reduce([], fn(x, acc) -> x ++ acc end)
#        Enum.map(&Task.async(Longpoll.Rights, :get_rights, [user, &1, right])) |>
#        Enum.map(&Task.await(&1, 100000)) |>
#        Enum.reduce([], fn(x, acc) -> x ++ acc end)
  end

  def get_all_rights(user, devices, right, acc) do
    if length(devices) > 0 do
      devices_sliced = Enum.split(devices, 1000)
#      IO.inspect(devices_sliced)
#      rights_servers = [:lr1, :lr2, :lr3, :lr4, :lr5, :lr6, :lr7, :lr8, :lr9, :lr10]
      rights_servers = [Rights1, Rights2, Rights3, Rights4, Rights5, Rights6, Rights7, Rights8, Rights9, Rights10]
#      devices_checked = Longpoll.Rights.get_rights(user, elem(devices_sliced, 0) , right)
      devices_checked = GenServer.call(Enum.random(rights_servers), {:get_rights, user, elem(devices_sliced, 0) , right}, 10000000)
      get_all_rights(user, elem(devices_sliced, 1), right, devices_checked ++ acc)
    else
      acc
    end
  end
end