defmodule Gis.Api.ObjectsController do
    use Gis.Web, :controller

    import Geo.PostGIS

    alias Gis.Objects
    alias Gis.ObjectTypes
    alias Gis.MapAssocs

    def index(conn, %{"map_id" => map_id}) do
        objects = Gis.Repo.all(from o in Gis.GisObject,
                                 join: ma in Gis.GisMapAssoc, on: o.id == ma.gisobjects_id,
                                 join: ot in Gis.GisObjectType, on: o.gisobjecttypes_id == ot.id,
                                 where: ma.gismaps_id == ^map_id,
                                 select: %{id: o.id, go_id: o.go_id, go_description: o.go_description,
                                           go_attributes: o.go_attributes, go_enabled: o.go_enabled,
                                           go_angle: o.go_angle, go_position: o.go_position,
                                           go_type: ot.ot_name, go_name: o.go_name})
        render conn, "index.json", objects: objects
    end

    def on_map(conn, %{"map_id" => map_id, "latmin" => latmin, "lonmin" => lonmin, "latmax" => latmax, "lonmax" => lonmax}) do
        {float_latmin, _} = Float.parse(latmin)
        {float_latmax, _} = Float.parse(latmax)
        {float_lonmin, _} = Float.parse(lonmin)
        {float_lonmax, _} = Float.parse(lonmax)
        user = get_resp_header(conn, "username")
        objects = Gis.Repo.all(from o in Gis.GisObject,
                                 join: ma in Gis.GisMapAssoc, on: o.id == ma.gisobjects_id,
                                 join: ot in Gis.GisObjectType, on: o.gisobjecttypes_id == ot.id,
                                 where: ma.gismaps_id == ^map_id and st_x(o.go_position) >= ^float_latmin
                                  and st_x(o.go_position) <= ^float_latmax and st_y(o.go_position) <= ^float_lonmax
                                  and st_y(o.go_position) <= ^float_lonmin,
                                 select: %{id: o.id, go_id: o.go_id, go_description: o.go_description,
                                           go_attributes: o.go_attributes, go_enabled: o.go_enabled,
                                           go_angle: o.go_angle, go_position: o.go_position,
                                           go_type: ot.ot_name, go_name: o.go_name})
        render conn, "index.json", objects: objects
    end
	
	def on_map_filter(conn, %{"map_id" => map_id, "latmin" => latmin, "lonmin" => lonmin, 
						      "latmax" => latmax, "lonmax" => lonmax, "perpage" => perpage, "page" => page}) do
          {float_latmin, _} = Float.parse(latmin)
          {float_latmax, _} = Float.parse(latmax)
          {float_lonmin, _} = Float.parse(lonmin)
          {float_lonmax, _} = Float.parse(lonmax)
		  {page, _} = Integer.parse(page)
		  {perpage, _} = Integer.parse(perpage)
		  IO.inspect(page)
		  IO.inspect(perpage)
		  limit = page * perpage
		  offset = limit + perpage
          user = get_resp_header(conn, "username")
          objects = Gis.Repo.all(from o in Gis.GisObject,
                                   join: ma in Gis.GisMapAssoc, on: o.id == ma.gisobjects_id,
                                   join: ot in Gis.GisObjectType, on: o.gisobjecttypes_id == ot.id,
                                   where: ma.gismaps_id == ^map_id and st_x(o.go_position) >= ^float_latmin
                                    and st_x(o.go_position) <= ^float_latmax and st_y(o.go_position) <= ^float_lonmax
                                    and st_y(o.go_position) <= ^float_lonmin,
									order_by: [desc: o.id],
                                   select: %{id: o.id, go_id: o.go_id, go_enabled: o.go_enabled,
                                             go_angle: o.go_angle, go_position: o.go_position,
                                             go_type: ot.ot_name, go_name: o.go_name},
								   limit: ^limit, offset: ^offset)
          render conn, "index.json", objects: objects
	end
end
