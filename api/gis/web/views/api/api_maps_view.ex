defmodule Gis.Api.MapsView do
  use Gis.Web, :view
  def render("show.json", %{data: data}) do
    IO.inspect(data)
      {center_lat, center_lon} = data.map_center.coordinates
      [{mre_lat_min, mre_lon_min}, {mre_lat_max, mre_lon_max}] = data.map_restricted_extent.coordinates
      %{map_name: data.map_name, id: data.id, 
        map_zoom: data.map_zoom, map_attributes: data.map_attributes,
        map_default: data.map_default,
        map_center: %{lat: center_lat, lon: center_lon},
        map_restricted_extent: [%{lat: mre_lat_min, lon: mre_lon_min}, 
                                %{lat: mre_lat_max, lon: mre_lon_max}],
        gisoverlayersets: render_one(data.gisoverlayersets, Gis.Api.OverlayerSetsView, 
                                        "overlayerset.json", as: :overlayerset),
        gismaptypes: render_one(data.gismaptypes, Gis.Api.MapTypeView,
                                                "gismaptypes.json", as: :gismaptypes)
      }
  end
end