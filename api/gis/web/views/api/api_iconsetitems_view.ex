defmodule Gis.Api.IconSetItemsView do
  use Gis.Web, :view

  def render("iconsetitems.json", %{iconsetitems: iconsetitems}) do
      %{id: iconsetitems.id, icon_image: iconsetitems.icon_image,
        icon_name: iconsetitems.icon_name}
  end
end