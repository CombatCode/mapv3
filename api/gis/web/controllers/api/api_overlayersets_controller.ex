defmodule Gis.Api.OverlayerSetsController do
    use Gis.Web, :controller

    alias Gis.Overlayersets
    alias Gis.Overlayers
	alias Gis.Map
	
    def show(conn, %{"map_id" => map_id}) do
        overlayerset = Gis.Repo.all(from u in Gis.GisOverlayerSet, 
									join: ma in Gis.GisMap, on: u.id == ma.gisoverlayersets_id, 
									where: ma.id == ^map_id,
                                    select: %{ovl_name: u.ovls_name, ovls_params: u.ovls_params, id: u.id}) 
        render conn, "show.json", overlayerset: overlayerset
    end
end
