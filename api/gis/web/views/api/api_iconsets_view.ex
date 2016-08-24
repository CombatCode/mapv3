defmodule Gis.Api.IconSetsView do
  use Gis.Web, :view

  def render("iconset.json", %{iconset: iconset}) do
  	  IO.inspect(iconset)
      %{id: iconset.id, 
        iconsetitem: render_many(iconset.gisiconsetitems, Gis.Api.IconSetItemsView, "iconsetitems.json", as: :iconsetitems)}
  end
end