defmodule Gis.Api.MapSetsController do
    use Gis.Web, :controller

    alias Gis.MapSets
    alias Gis.Maps

    def index(conn, _params) do
        mapsets = Gis.Repo.all(from u in Gis.GisMapSet,
                               select: %{ms_name: u.ms_name, ms_equal: u.ms_equal, id: u.id})
        render conn, "show.json", data: mapsets
    end

    def show(conn, %{"ms_id" => ms_id}) do
        maps_name = Gis.Repo.all(from u in Gis.GisMap,
                               where: u.gismapsets_id == ^ms_id, 
                               select: %{map_name: u.map_name, id: u.id} )
        render conn, "show.json", data: maps_name
    end
end
