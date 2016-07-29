defmodule Gis.Api.OverlayersController do
    use Gis.Web, :controller

    alias Gis.Overlayers

    def show(conn, %{"id" => id}) do
        overlayer = Gis.Repo.get(Gis.GisOverlayer, id)
        render conn, "show.json", data: overlayer
    end
end


