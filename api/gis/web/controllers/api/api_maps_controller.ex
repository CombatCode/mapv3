defmodule Gis.Api.MapsController do
    use Gis.Web, :controller

    alias Gis.Maps

    def show(conn, %{"map_id" => map_id}) do
        maps = Gis.Repo.one!(from u in Gis.GisMap,
        					where: u.id == ^map_id,
        					preload: [{:gisoverlayersets, [{:gisoverlayers, []}]}, :gismaptypes] )
        render conn, "show.json", data: maps
    end
end
