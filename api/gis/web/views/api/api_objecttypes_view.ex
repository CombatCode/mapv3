defmodule Gis.Api.ObjectTypesView do
  use Gis.Web, :view


  def render("index.json", %{objecttypes: objecttypes}) do
      %{objecttypes: render_many(objecttypes, __MODULE__, "objecttypes.json", as: :objecttypes)}
  end

  def render("objecttypes.json", %{objecttypes: objecttypes}) do
      IO.inspect(objecttypes)
      %{id: objecttypes.id, ot_name: objecttypes.ot_name, ot_params: objecttypes.ot_params, 
        iconset: render_one(objecttypes.gisiconsets, Gis.Api.IconSetsView, "iconset.json", as: :iconset)}
  end
end