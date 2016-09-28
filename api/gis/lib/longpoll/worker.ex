defmodule Longpoll.Worker do

  use Amnesia
  use GenServer
  
# API

  def start_link(opts) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  def add(object) do
    GenServer.cast(__MODULE__, {:add, object})
  end

  def get(pid, element) do
    GenServer.call(pid, {:get, element})
  end
  
  def add_filter() do
    GenServer.cast(__MODULE__, :add_filter)
  end

  def poll(pid) do
    GenServer.call(pid, :poll, :infinity)
  end

  def poll() do
    GenServer.call(__MODULE__, :poll)
  end

  def get_objects(pid, objects) do
	  GenServer.call(pid, {:get_objects, objects})
  end

  def get_objects(objects) do
	  GenServer.call(__MODULE__, {:get_objects, objects}, 100000)
  end

  def remove_item(id, user) do
    GenServer.cast(__MODULE__, {:remove_item, id, user})
  end



# CALLBACKS
  def init(:ok) do
    IO.puts("STATOROS")
    # Mnesia databases are readable for all modules which are run on VM ?
    port = "3080"
    # port = "5000"
    location = "192.168.8.180"
    user = "root"
    pass = "suser"
    clientip = "192.168.8.38"
    sessionkey = "70ca3048900b5c1f9dbfbe28426e1"
    options = [hackney: [basic_auth: {user, pass}],
               connect_timeout: 3000000, 
               recv_timeout: :infinity, 
               timeout: 3000000,
               stream_to: self,
             ]
    register_command = "register.json"
    url = "http://#{location}:#{port}/"
    headers = [{"Content-Type", "application/x-www-form-urlencoded"},
               {"Connection", "Keep-Alive"}]
               
    filter_name = "gis"
    
    data = %{"sessionkey" => sessionkey,
             "username" => "poma", 
             "clientip" => clientip,
             "jsondata" => nil}
             
    %HTTPoison.AsyncResponse{id: id} = HTTPoison.post!(url <> register_command, URI.encode_query(data), headers, options)
    response = collect_response(id, self, <<>>)
    
    subscriber_id = Map.get(response, "SubscriberId")

    filter_command = "addfilter.json"
    
    {:ok, cmd_addfilter} = %{"Msg" => %{
        "CmdRegFilter" => %{
            "TransactionNo" => 1,
            "FilterRef" => filter_name,
            "Filter" => %{
                "StsCamera" => 1,
                "StsLock" => 1,
#                "StsMaintenance" => 1,
               }
             }
           }
     } |> Poison.encode
     
    data_filter = data |>
        Map.put(:jsondata, cmd_addfilter) |>
        Map.put(:cumulative, 1) |>
        Map.put(:cookie, subscriber_id) |>
        URI.encode_query 
       
    %HTTPoison.AsyncResponse{id: id} = HTTPoison.post!(url <> filter_command, data_filter, headers, options)
    %{"FilterRef" => filter_name} = collect_response(id, self, <<>>)
    Process.send(self, :poll_request, [])
    {:ok, %{system_objects: %{}, subscriber_id: subscriber_id,
            filter_name: filter_name, data: data, headers: headers, url: "http://#{location}:#{port}/",
            options: options, transation_n: 1}}

  end

  def collect_response(id, par, data) do
    receive do
      %HTTPoison.AsyncStatus{id: ^id, code: 200} ->
        collect_response(id, par, data)
      %HTTPoison.AsyncHeaders{id: ^id, headers: headers} ->
        collect_response(id, par, data)
      %HTTPoison.AsyncChunk{id: ^id, chunk: chunk} ->
        collect_response(id, par, data <> chunk)
      %HTTPoison.AsyncEnd{id: ^id} ->
        send par, handle_response({:ok, %{status_code: 200, body: data}})
    end
  end

  def handle_response({:ok, %{status_code: 200, body: data}}) do
    {:ok, response} = Poison.decode(data)
    response
  end

  def add_response_to_state(resp, system_objects) do
    case resp do
       [h|t]  -> 
          sts_aggreagete = Map.get(h, "StsAggregate")
          sts_type =  sts_aggreagete |> Map.keys() |> List.first()
          sts = Map.get(sts_aggreagete, sts_type) |> Map.pop("Device")
          device =   elem(sts, 0)
          properties = elem(sts, 1)
          device_type = Map.get(device, "@Type")
          device_id = Map.get(device, "Id")
          device_id_type = device_id <> device_type
          status_device = case Map.get(system_objects, device_id_type) do
            %{id: id_, type: type_, users: users_, statuses: statuses_} ->
                statuses_ = Map.put(statuses_, sts_type, properties)
                %{id: id_, type: type_, users: users_, statuses: statuses_}
            nil -> %{id: device_id, type: device_type, 
                     users: MapSet.new(), 
                     statuses: %{sts_type => properties}}
          end
          Process.send(Longpoll.Dbworker, {:brodcast_to_users_by_device, device_id_type,
                                           %{id: device_id, type: device_type,
                                             statuses: %{sts_type => properties}}}, [])
          Process.send(Longpoll.Dbworker, {:put_status_to_cache, device_id_type,
            %{id: status_device.id, type: status_device.type, statuses: status_device.statuses}}, [])
          system_objects = Map.put(system_objects, device_id <> device_type, status_device)
          add_response_to_state(t, system_objects)
       [] -> system_objects
    end  
  end

  def handle_cast(:add_filter, state) do
    command_json = "addfilter.json"
    url = Map.get(state, :url) <> command_json
    filter_name = Map.get(state, :filter_name)
    transation_n = Map.get(state, :transation_n) + 1
    options = Map.get(state, :options)
    headers = Map.get(state, :headers)

    {:ok, cmd_addfilter} = %{"Msg" => %{
      "CmdRegFilter" => %{
        "TransactionNo" => transation_n,
        "FilterRef" => filter_name,
        "Filter" => %{
          "StsCamera" => 1,
          "StsLock" => 1,
          "StsMaintenance" => 1,
          }
        }
      }
    } |> Poison.encode

    data = Map.get(state, :data) |>
      Map.put(:jsondata, cmd_addfilter) |>
      Map.put(:cumulative, 1) |>
      Map.put(:cookie, Map.get(state, :subscriber_id)) |>
      URI.encode_query 
    %HTTPoison.AsyncResponse{id: id} = HTTPoison.post!(url, data, headers, options)
    response = collect_response(id, self, <<>>) 
    state = Map.put(state, :filter_name, filter_name) |>
      Map.put(:transation_n, transation_n)
    {:noreply, state}
  end

  # ADD
  def handle_cast({:add, object}, state) do
    %{id: id, type: type, users: users} = object
    system_objects = Map.get(state, :system_objects)
    users = case Map.get(system_objects, id) do
      %{id: id_, type: type_, users: users_} ->  MapSet.union(users_, users)
      nil -> users
    end
    system_objects = Map.put(system_objects, id, %{id: id, type: type, users: users})
    state = Map.put(state, :system_objects, system_objects)
    IO.inspect(state)
    {:noreply, state}
  end

  # POLL
  def handle_info(:poll_request, state) do
    response = poll_request(state)
    system_objects = add_response_to_state(response, Map.get(state, :system_objects))
#    Gis.Endpoint.broadcast(response)
    state = Map.put(state, :system_objects, system_objects)
    Process.send(self, :poll_request, [])
    {:noreply, state}
  end

  def handle_info(_, state) do
    {:noreply, state}

  end

  def poll_request(state) do
    command_json = "poll.json"
    url = Map.get(state, :url) <> command_json
    data = data = Map.get(state, :data) |>
      Map.put(:cookie, Map.get(state, :subscriber_id)) |>
      URI.encode_query
    headers = Map.get(state, :headers)
    options = Map.get(state, :options)
    # %HTTPoison.AsyncResponse{id: id} = HTTPoison.post!(url, data, headers, options)
    # {:ok, response} = HTTPoison.post!(url, data, headers, options).body |> Poison.decode
    %HTTPoison.AsyncResponse{id: id} = HTTPoison.post!(url, data, headers, options)
    response = collect_response(id, self, <<>>)
    response
  end

  def handle_call(:poll, _from, state) do
    response = poll_request(state)
    system_objects = add_response_to_state(response, Map.get(state, :system_objects))
    state = Map.put(state, :system_objects, system_objects) 
    {:reply, system_objects, state}
  end

  # GET
  def handle_call({:get, element}, _from, state) do
    status_element = Map.get(state, element)
    {:reply, status_element, state}
  end

  def get_from_state(objects, state) do
    objects_list = MapSet.to_list(objects)
    get_from_state(objects_list, state, %{})
  end
  def get_from_state(objects, state, agg) do
    case objects do
      [h|t] -> get_from_state(t, state, Map.put(agg, h, Map.get(state, h)))
      [] -> agg
    end
  end

  def handle_call({:get_objects, objects}, _from, state) do
    # move it to mnesia
    objects_set = MapSet.new(objects)
	  system_objects = Map.get(state, :system_objects)
#	  return_objects = Enum.filter(system_objects, fn{k, v} -> MapSet.member?(objects_set, k) end)
    return_objects = get_from_state(objects_set, system_objects)
	  {:reply, return_objects, state}
  end
  
  defp schedule_work() do
	  Process.send(self(), :poll, [])
  end

end
