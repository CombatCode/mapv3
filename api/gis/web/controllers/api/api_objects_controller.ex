defmodule Gis.Api.ObjectsController do
    use Gis.Web, :controller

    alias Gis.Objects
    alias Gis.ObjectTypes
    alias Gis.MapAssocs

    def index(conn, %{"id" => id}) do
        objects = Gis.Repo.all(from o in Gis.GisObject,
                                 join: ma in Gis.GisMapAssoc, on: o.id == ma.gisobjects_id,
                                 join: ot in Gis.GisObjectType, on: o.gisobjecttypes_id == ot.id,
                                 where: ma.gismaps_id == ^id,
                                 select: %{id: o.id, go_id: o.go_id, go_description: o.go_description,
                                           go_attributes: o.go_attributes, go_enabled: o.go_enabled,
                                           go_angle: o.go_angle, go_position: o.go_position, 
                                           go_type: ot.ot_name, go_name: o.go_name})
        render conn, "index.json", objects: objects
    end

    # def on_map(conn, %{"id" => id, "latmin" => latmin, "lonmin" => lonmin, "latmax" => latmax, "lonmax" => lonmax}) do
    #     objects = Gis.Repo.all(from o in Gis.GisObject,
    #                              join: ma in Gis.GisMapAssoc, on: o.id == ma.gisobjects_id,
    #                              join: ot in Gis.GisObjectType, on: o.gisobjecttypes_id == ot.id,
    #                              where: ma.gismaps_id == ^id and st_x(o.go_position) > ^latmin
    #                               and st_x(o.go_position) < ^latmax and st_y(o.go_position) < ^lonmax
    #                               and st_y(o.go_position) < ^lonmin,
    #                              select: %{id: o.id, go_id: o.go_id, go_description: o.go_description,
    #                                        go_attributes: o.go_attributes, go_enabled: o.go_enabled,
    #                                        go_angle: o.go_angle, go_position: o.go_position, 
    #                                        go_type: ot.ot_name, go_name: o.go_name})
    #     render conn, "index.json", objects: objects
    # end
end


