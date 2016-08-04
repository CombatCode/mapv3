defmodule Gis.Api.OverlayersView do
  use Gis.Web, :view

  def render("show.json", %{data: data}) do
      IO.inspect(data)
      %{ovl_name: data.ovl_name, id: data.id, 
        ovl_attributes: data.ovl_attributes,
        ovl_icon: data.ovl_icon, ovl_description: data.ovl_description,
        ovl_type: data.ovl_type}
  end
end