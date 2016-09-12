defmodule Gis.Api.MapTypeView do
  use Gis.Web, :view

  def render("gismaptypes.json", %{gismaptypes: gismaptypes}) do
      IO.inspect(gismaptypes)
      %{id: gismaptypes.id, map_type_geographic: gismaptypes.map_type_geographic, map_type_name: gismaptypes.map_type_name,
        map_type_attributes: gismaptypes.map_type_attributes}
  end

  def render("show.json", %{gismaptypes: gismaptypes}) do
	  gismaptypes
  end
end