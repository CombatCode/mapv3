use Amnesia

defdatabase Longpoll.CacheDatabase do
  # Contains objects registered to users
	deftable UserRegister, [:username, :register], type: :ordered_set do
		@type t :: %UserRegister{username: String.t, register: MapSet.t}
	end	
	deftable UserRights, [:username, :rights], type: :ordered_set do
		@type t :: %UserRights{username: String.t, rights: Map.t}
		
		def add_rights(user, devices, right) do
			 rights = 
			 	for x <- devices, 
				device = Map.get(x, "DeviceIdentity"),
				id = Map.get(device, "Id"),
				type = Map.get(device, "@Type") do 
					%{id<>type => %{"right" => right, "id" => id, "type" => type}} 
				end
			 %UserRights{username: user, rights: rights} |> UserRights.write
		end
	end
	
	deftable GisObjects, [:id, :gis_objects], type: :ordered_set do
		@type t :: %GisObjects{id: integer, gis_objects: List}
	end

	deftable GisStatuses, [:id, :status_object], type: :ordered_set do
	  @type t :: %GisStatuses{id: String.t, status_object: Map.t}
	end

  # Contains users registered to objects
	deftable GisRegister, [:id, :users], type: :ordered_set do
    @type t :: %GisRegister{id: String.t, users: MapSet.t}
	end
end
