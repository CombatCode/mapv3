defmodule Gis.Api.OverlayersController do
    use Gis.Web, :controller

    alias Gis.Overlayers

    def show(conn, %{"ovs_id" => ovs_id}) do
        overlayer = Gis.Repo.get(Gis.GisOverlayer, ovs_id)
        render conn, "show.json", data: overlayer
    end
end


