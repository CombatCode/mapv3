defmodule Longpoll.Rights do

  use GenServer

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end
  
  def get_rights(user, chunk, rights) do
	  GenServer.call(__MODULE__, {:get_rights, user, chunk, rights}, 10000)
  end

# CALLBACKS
  def init(:ok) do
    port = "3080"
    # location = "192.168.18.114"
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
			 	 
    headers = [{"Content-Type", "application/x-www-form-urlencoded"},
               {"Connection", "Keep-Alive"}]

    data = %{"sessionkey" => sessionkey,
             "username" => "poma", 
             "clientip" => clientip,
             "jsondata" => nil}

    {:ok, %{users: %{}, data: data, headers: headers, url: "http://#{location}:#{port}/",
           options: options, transation_n: 0}}
  end

  def gen_cookie(name) do
	  name |>
	  to_char_list |>
	  Enum.map(fn x -> to_string x end) |>
	  Enum.join("")|>
	  String.to_integer()
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

  def rights_request(user, chunk, rights, state) do
      command_json = "proxy.json"
      url = Map.get(state, :url) <> command_json
      transation_n = Map.get(state, :transation_n) + 1
      options = Map.get(state, :options)
      headers = Map.get(state, :headers)

      # Generate devices for check right
#      IO.inspect(chunk)
      devices =  for x <- chunk, do: %{"DeviceIdentity" => %{"Id" => Map.get(x, "Id"), "@Type" => Map.get(x, "Type")}}
      rights_list = cond do
        is_list(rights) -> for x <- rights, do: %{"AccessRightType" => x}
        true -> [%{"AccessRightType" => rights}]
      end
      IO.puts("Damian jeszcze nie ... ")
      {:ok, cmd_bachcheckrights} = %{"Msg" => %{
              "CmdBatchCheckRight" => %{
              "TransactionNo" => transation_n,
              "User" => %{"Name" => user},
                  "Cookie" => gen_cookie(user),
                  "Rights" => rights_list,
                  "Devices" => devices
                  }
             }
           } |> Poison.encode

       data = Map.get(state, :data) |>
          Map.put(:jsondata, cmd_bachcheckrights) |>
          URI.encode_query

        # response = HTTPoison.post!(url, data, headers, options)
        # IO.inspect(response)
        %HTTPoison.AsyncResponse{id: id} = HTTPoison.post!(url, data, headers, options)
        response = collect_response(id, self, <<>>)
            # {:ok, response} = response.body |> Poison.decode
            cmd_response = Map.get(response, "CmdResponse")
            call_result = Map.get(cmd_response, "CallResult")
            if call_result == "X_OK" do
                sts = Map.get(cmd_response, "StsAggregate") |>
                    Map.get("StsBatchCheckRight")
                rights = Map.get(sts, "Rights")
                devices = Map.get(sts, "Devices")

                # cache_devices(user, devices, rights)
            else
                devices = %{}
            end
    devices
  end

  def handle_info({:get_user_rights, user, chunk, rights}, state)  do
    devices = rights_request(user, chunk, rights, state)
    {:reply, devices, state}
  end

  def handle_info(_, state) do
    {:noreply, state}
  end

  def handle_call({:get_rights, user, chunk, rights}, _from, state) do
    devices = rights_request(user, chunk, rights, state)
    {:reply, devices, state}
  end
  end
