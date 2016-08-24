defmodule Gis.Api.OverlayersView do
  use Gis.Web, :view

  def render("overlayers.json", %{overlayers: overlayers}) do
      IO.inspect(overlayers)
      %{ovl_name: overlayers.ovl_name, id: overlayers.id, 
        ovl_attributes: overlayers.ovl_attributes,
        ovl_icon: overlayers.ovl_icon, ovl_description: overlayers.ovl_description,
        ovl_type: overlayers.ovl_type}
  end
  
  def render("show.json", %{overlayer: overlayer}) do
      %{overlayers: render_many(overlayer, __MODULE__, "overlayers.json", as: :overlayers)}
  end
  

end
