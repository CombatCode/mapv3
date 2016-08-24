defmodule Gis.Api.OverlayersController do
    use Gis.Web, :controller

    alias Gis.Overlayers
	alias Gis.Overlayersets

    def show(conn, %{"ovs_id" => ovs_id}) do
        overlayer = Gis.Repo.all(from u in Gis.GisOverlayer,
					join: us in Gis.GisOverlayerSet, on: u.gis_overlayer_set_id == us.id,
					where: us.id == ^ovs_id)
        render conn, "show.json", overlayer: overlayer
    end
end


