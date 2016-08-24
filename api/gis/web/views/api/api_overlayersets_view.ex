defmodule Gis.Api.OverlayerSetsView do
  use Gis.Web, :view

  def render("overlayerset.json", %{overlayerset: overlayerset}) do
      IO.inspect(overlayerset)
	  IO.puts("tU")
      %{id: overlayerset.id, ovls_params: overlayerset.ovls_params,
      	ovls_name: overlayerset.ovls_name,
        overlayers: render_many(overlayerset.gisoverlayers, Gis.Api.OverlayersView, "overlayers.json", as: :overlayers)}
  end
  
  def render("show.json", %{overlayerset: overlayerset}) do
	  overlayerset
  end
end