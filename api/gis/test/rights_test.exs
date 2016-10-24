defmodule RightsTest do
  use ExUnit.Case
  use Amnesia
  doctest Longpoll.Rights

  use CacheDatabase, as: CD

  setup_all do
  	Amnesia.start
    CacheDatabase.create(ram: [node])
	
	files = "./test/temp.txt" |>
		File.stream! |>
		Stream.map(&String.split/1) |>
		Enum.reduce([], fn(x, acc) -> acc ++ x end)
		
	elements = for x <- files, do: %{"Id" => x, "Type" => "Camera"}
	# IO.inspect(elements)
  	Amnesia.transaction do
	     %GisObjects{id: 1, gis_objects: elements} |> GisObjects.write
	end 
	{:ok, pid} = Longpoll.Rights.start_link
  	{:ok, pid: pid}
  end

  @tag timeout: 60000000
  test "get_rights", state do
	  # Read all devices cached in mnesia database
	  devices = Amnesia.transaction do 
		  GisObjects.read(1)
	  end
	  # Chunk devices into groups per 1000 objects
	  devices_chunk = Enum.chunk(devices.gis_objects, 1000, 1000, [])
	  IO.inspect(length(devices_chunk))
	  # Set interested rights
	  right = "ObjView"
	  # Set user for test purpose
	  user = "mm"
	  # Get all deviec by async check
	  all_devices = get_all_rights(state[:pid], devices_chunk, user, right)
	  IO.inspect(length(all_devices))
	  Amnesia.transaction do
			UserRights.add_rights(user, all_devices, right)
	  end
	  check_right = Amnesia.transaction do
		  UserRights.read(user)
	  end
	  assert length(devices_chunk) == 2
	  assert length(check_right.rights) > 0
  end
  
  def get_all_rights(pid, counter, user, right) do
	  counter |> 
	  	Stream.map(&Task.async(Longpoll.Rights, :get_rights, [pid, user, &1, right])) |>
	  	Enum.map(&Task.await(&1, 100000)) |>
		Enum.reduce([], fn(x, acc) -> x ++ acc end)
	  # case counter do
	  #  [h|t] ->
	  # 		   task = Task.async(fn -> Longpoll.Rights.get_rights(pid, "mm", h) end)
	  # 		   # call = Longpoll.Rights.get_rights(pid, "mm", h)
	  # 		   get_all_rights(pid, t, task ++ tasks)
	  #  [] ->  await tasks
	  # end
  end
end