defmodule Gis.Api.OverlayerSetsController do
    use Gis.Web, :controller

    alias Gis.Overlayersets
    alias Gis.Overlayers

    def index(conn, %{"id" => id}) do
        overlayers = Gis.Repo.all(from u in Gis.GisOverlayer, 
                                    where: u.gisoverlayersets_id == ^id,
                                    select: %{ovl_name: u.ovl_name, id: u.id}) 
        render conn, "show.json", data: overlayers
    end
end
