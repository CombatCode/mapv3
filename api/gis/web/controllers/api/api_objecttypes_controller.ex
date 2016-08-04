defmodule Gis.Api.ObjectTypesController do
    use Gis.Web, :controller

    alias Gis.ObjectTypes
    alias Gis.IconSets
    alias Gis.IconSetItems

    def index(conn, _params) do
        objecttypes = Gis.Repo.all(from ot in Gis.GisObjectType,
                                #  join: is in Gis.GisIconSet, on: ot.gisiconsets_id == is.id,
                                   preload: [{:gisiconsets, [{:gisiconsetitems, []}]}])
        render conn, "index.json", objecttypes: objecttypes
    end
end