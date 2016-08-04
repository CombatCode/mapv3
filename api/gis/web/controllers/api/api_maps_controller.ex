defmodule Gis.Api.MapsController do
    use Gis.Web, :controller

    alias Gis.Maps

    def show(conn, %{"map_id" => map_id}) do
        maps = Gis.Repo.get!(Gis.GisMap, map_id)
        render conn, "show.json", data: maps
    end
end
