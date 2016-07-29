defmodule Gis.Api.MapsController do
    use Gis.Web, :controller

    alias Gis.Maps

    def show(conn, %{"id" => id}) do
        maps = Gis.Repo.get!(Gis.GisMap, id)
        # maps_name = Gis.Repo.get!(from u in Gis.GisMap,
        #                        where: u.id == ^id, 
        #                        select: %{map_name: u.map_name, id: u.id, 
        #                                  map_zoom: u.map_zoom, map_features: u.map_features,
        #                                  map_default: u.map_default, map_geographic: u.map_geographic,
        #                                  map_center: u.map_center, map_restricted_extent: u.map_restricted_extent,
        #                                  gisoverlayersets_id: u.gisoverlayersets_id} )
        render conn, "show.json", data: maps
    end
end
