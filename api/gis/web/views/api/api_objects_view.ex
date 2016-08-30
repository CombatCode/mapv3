defmodule Gis.Api.ObjectsView do
  use Gis.Web, :view


  def render("index.json", %{objects: objects}) do
      render_many(objects, Gis.Api.ObjectsView, "object.json", as: :object)
  end

  def render("show.json", %{object: object}) do
      %{object: render_one(object, Gis.Api.ObjectsView, "object.json")}
  end

  def render("object.json", %{object: object}) do
      {object_lat, object_lon} = object.go_position.coordinates
      %{go_name: object.go_name,
	    id: object.id,
		go_id: object.go_id,
        # go_description: object.go_description, go_attributes: object.go_attributes,
        go_enabled: object.go_enabled, go_angle: object.go_angle, 
        go_position: %{lat: object_lat, lon: object_lon}, 
        go_type: object.go_type}
  end
end