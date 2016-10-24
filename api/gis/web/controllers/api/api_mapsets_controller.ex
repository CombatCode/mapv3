defmodule Gis.Api.MapSetsController do
    use Gis.Web, :controller

    alias Gis.MapSets
    alias Gis.Maps
    alias Gis.MapAccos
    alias Gis.Objects
    alias Gis.ObjectTypes

    def index(conn, _params) do
        mapsets = Gis.Repo.all(from u in Gis.GisMapSet,
                               select: %{ms_name: u.ms_name, ms_equal: u.ms_equal, id: u.id})
        render conn, "show.json", data: mapsets
    end

    def show(conn, %{"ms_id" => ms_id}) do
        maps_name = Gis.Repo.all(from u in Gis.GisMap,
                               where: u.gis_map_set_id == ^ms_id,
                               select: %{map_name: u.map_name, id: u.id} )
        render conn, "show.json", data: maps_name
    end

    def locations(conn, %{"feature_id" => feature_id, "feature_type" => feature_type}) do
        objects = Gis.Repo.all(from ms in Gis.GisMapSet,
                               join: m in Gis.GisMap, on: ms.id == m.gis_map_set_id,
                               join: ma in Gis.GisMapAssoc, on: m.id == ma.gis_map_id,
                               join: o in Gis.GisObject, on: ma.gis_object_id == o.id,
                               join: ot in Gis.GisObjectType, on: o.gisobjecttypes_id == ot.id,
                               where: o.id == ^feature_id  and ot.ot_name == ^feature_type,
                               preload: [gismaps: {m, gismapassocs: {ma, gisobjects: o}}]
                               )
        render conn, "locations.json", data: objects
    end
end
