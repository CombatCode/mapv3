defmodule Gis.Api.MapAssocsView do
    use Gis.Web, :view

  def render("show_structure.json", %{mapassocs: mapassocs}) do
#    IO.inspect(mapassocs.gisobjects)
    render_one(mapassocs.gisobjects ,Gis.Api.ObjectsView, "show_structure.json", as: :object)
  end

end

#protocol Enumerable not implemented for %Gis.GisObject{__meta__: #Ecto.Schema.Metadata<:loaded, "gisobjects">, gismapassocs: #Ecto.Association.NotLoaded<association :gismapassocs is not loaded>, gisobjecttypes: #Ecto.Association.NotLoaded<association :gisobjecttypes is not loaded>, gisobjecttypes_id: 7, go_angle: 0.0, go_attributes: %{}, go_description: "Test Description", go_enabled: true, go_id: 83921, go_name: "Camera: 393347", go_position: %Geo.Point{coordinates: {46.22865751588282, 2.6586750687390914}, srid: 4326}, id: 66859, inserted_at: #Ecto.DateTime<2016-09-09 08:05:11>, updated_at: #Ecto.DateTime<2016-09-09 08:05:11>}

