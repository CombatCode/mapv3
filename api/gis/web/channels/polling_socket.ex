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
#    case devices do
#      [h|t] -> Process.send(Longpoll.Dbworker, {:register_user_to_device, user, h}, [])
#        attach_to_polling(user, t)
#      [] -> Longpoll.Dbworker.get_statuses(devices)
#    end
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
    IO.inspect(polled_objects)
    {:reply, {:ok, %{objects: polled_objects}}, socket}
  end

  def handle_info(:after_join, socket) do
    user = socket.assigns.user_id
    devices = Longpoll.Dbworker.get_objects()
    # Chunk devices into groups per 1000 objects
    devices_chunk = Enum.chunk(devices.gis_objects, 1000, 1000, [])
    right_devices = get_all_rights(user, devices_chunk, "ObjView")
    Longpoll.Dbworker.cache_rights(user, right_devices, "ObjView")
    push socket, "register:start", %{status: "get ready to rumble!"}
    {:noreply, socket}
  end

  def handle_info(_, socket) do
    {:noreply, socket}
  end

  def get_all_rights(user, devices, right) do
    devices |>
        Stream.map(&Task.async(Longpoll.Rights, :get_rights, [user, &1, right])) |>
        Enum.map(&Task.await(&1, 100000)) |>
        Enum.reduce([], fn(x, acc) -> x ++ acc end)
  end

end