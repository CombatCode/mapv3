# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Gis.Repo.insert!(%Gis.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
m = 20
m_per_ms = 3
objects_per_map = 300
map_data = %{latmin: 42.25, latmax: 51.100, lonmin: -5.2, lonmax: 8.23}
object_types = ["camera", "sensor", "camera_ptz"]
angle_variation = [0.0, 360.0]
map_types = [
    %{
        map_type_geographic: true,
        map_type_name: "OpenStreet",
        map_type_attributes: %{
            url_pattern: "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: %{attribution: "Teleste.com", maxZoom: 18}
        }
    }, %{
        map_type_geographic: false,
        map_type_name: "Kosmos",
        map_type_attributes: %{
            bounds: [[0,0], [1000,1000]],
            overlay_url: "http://leafletjs.com/examples/crs-simple/uqm_map_full.png"
        }
    }
]

defmodule Seeds do
    def import_data(map_data, object_types, m, m_per_ms, av, opm, map_types) do
        Gis.Repo.delete_all(Gis.GisMapAssoc)
        Gis.Repo.delete_all(Gis.GisMapType)
        Gis.Repo.delete_all(Gis.GisMap)
        Gis.Repo.delete_all(Gis.GisMapSet)
        Gis.Repo.delete_all(Gis.GisOverlayer)
        Gis.Repo.delete_all(Gis.GisOverlayerSet)
        Gis.Repo.delete_all(Gis.GisIconSetItem)
        Gis.Repo.delete_all(Gis.GisObject)
        Gis.Repo.delete_all(Gis.GisObjectType)
        Gis.Repo.delete_all(Gis.GisIconSet)
        objects_map_types = import_maptypes(map_types, [])
        iconset = import_iconset()
        iconitem = import_iconsetitem(iconset)
        object_types = import_objecttypes(object_types, iconset)
        import_mapsets(m, m_per_ms, map_data, object_types, opm, objects_map_types)
    end

# olvs_name, ovls_params, ovls_order	
    def import_overlayerset(name) do
        ovl_set = Gis.Repo.insert!(%Gis.GisOverlayerSet{ovls_name: "TEST #{name}", ovls_params: %{},
                                                    ovls_order: 1})
        ovl_set
    end

    def import_maptypes(map_types, objects_map_types) do
        if length(map_types) > 0 do
            map_type = List.first(map_types)
            object = Gis.Repo.insert!(%Gis.GisMapType{map_type_geographic: map_type.map_type_geographic, map_type_name: map_type.map_type_name, map_type_attributes: map_type.map_type_attributes})
            map_types = List.delete(map_types, map_type)
            objects_map_types = objects_map_types ++ [object]
            import_maptypes(map_types, objects_map_types)
        else
            IO.puts("Map Types import success")
            objects_map_types
        end
    end

    def import_mapsets(m, m_per_ms, md, ot, opm, objects_map_types) do
        how_many_map_sets = div m, m_per_ms
        if how_many_map_sets > 0 do
            ms = Gis.Repo.insert!(%Gis.GisMapSet{ms_name: "MapSets #{m}", ms_equal: false}, log: false)
            ovl_set = import_overlayerset(m)
            import_map(ms, md, ot, m_per_ms, ovl_set, ot, opm, objects_map_types)
            import_mapsets(m - m_per_ms , m_per_ms, md, ot, opm, objects_map_types)
        else
            IO.puts("Import success")          
        end
    end

# map_name, map_zoom, map_features, map_default, map_geographic, map_center, map_max_extent, 
# map_restricted_extent, gismapsets_id, gisoverlayersets_id
    def import_map(ms, md, ot, m_per_ms, ovl_set, object_types, objects_per_map, objects_map_types) do
        :random.seed(:erlang.now())
        map_boundary = %{}
        random_map_type = Enum.random(objects_map_types)

        map_boundary =
            case random_map_type.map_type_geographic do
                true -> get_boundary(md)
                false ->
                    [minbound, maxbound] = random_map_type.map_type_attributes.bounds
                    [latmin, lonmin] = minbound
                    [latmax, lonmax] = maxbound
                    %{latmin: latmin, latmax: latmax, lonmin: lonmin, lonmax: lonmax}
            end

        map_extent = %Geo.MultiPoint{coordinates: [{map_boundary.latmin, map_boundary.lonmin}, 
                                                {map_boundary.latmax, map_boundary.lonmax}], srid: 4326}
        map_center = %Geo.Point{coordinates: {(map_boundary.latmin + map_boundary.latmax)/2, 
                                              (map_boundary.lonmin + map_boundary.lonmax)/2}, srid: 4326}
        if m_per_ms > 0 do	
            m = Gis.Repo.insert!(%Gis.GisMap{map_name: "Map #{m_per_ms}", map_zoom: %{zoom_levels: []},
                                             map_attributes: %{}, map_default: false,
                                             map_center: map_center, map_max_extent: nil,
                                             map_restricted_extent: map_extent, gismapsets_id: ms.id,
                                             gisoverlayersets_id: ovl_set.id, gismaptypes_id: random_map_type.id
                                             })
            ovl = import_overlayer("OVLTEST #{m_per_ms}", ovl_set, map_boundary)
            objects = import_objects(object_types, objects_per_map, map_boundary)
            import_mapassoc(objects, m)
            import_map(ms, md, ot, m_per_ms - 1, ovl_set, object_types, objects_per_map, objects_map_types)
        else
            IO.puts("Map import success")
        end

    end

    def import_mapassoc(objects, m) do
        case objects do
            [h|t] -> 
                ma = Gis.Repo.insert!(%Gis.GisMapAssoc{gismaps_id: m.id, gisobjects_id: h.id})
                import_mapassoc(t, m)
            [] -> 
                IO.puts("Import map assocs")
        end
    end

    def get_boundary(boundary) do
        lathalf = (boundary.latmax - boundary.latmin)/2
        lonhalf = (boundary.lonmax - boundary.lonmin)/2
        latmin = :random.uniform()*(boundary.latmax - boundary.latmin)/2 + boundary.latmin
        latmax = :random.uniform()*(boundary.latmax - boundary.latmin) + boundary.latmin + lathalf
        lonmin = :random.uniform()*(boundary.lonmax - boundary.lonmin) + boundary.lonmin
        lonmax = :random.uniform()*(boundary.lonmax - boundary.lonmin) + boundary.lonmin + lonhalf
        %{latmin: latmin, latmax: latmax, lonmin: lonmin, lonmax: lonmax}
    end

    def get_point_from_bounary(boundary) do
        :random.seed(:erlang.now())
        lat = :random.uniform()*(boundary.latmax - boundary.latmin) + boundary.latmin
        lon = :random.uniform()*(boundary.lonmax - boundary.lonmin) + boundary.lonmin
        %Geo.Point{coordinates: {lat, lon}, srid: 4326}
    end
	
# iset_name,iset_category	
    def import_iconset() do
        iconset = Gis.Repo.insert!(%Gis.GisIconSet{iset_name: "IconSet", iset_category: "Fine icons"})
        iconset
    end


# icon_name, icon_image, icon_set_id
    def import_iconsetitem(iconset) do
        icon = Gis.Repo.insert!(%Gis.GisIconSetItem{icon_name: "Icon", icon_image: "icon.png", gis_icon_set_id: iconset.id})
    end


    def import_objecttypes(object_types, iconset) do
        types = import_objecttypes(object_types, iconset, [])
        types
    end
    def import_objecttypes(object_types, iconset, types) do
        case object_types do
            [h|t] -> 
                obj_type = Gis.Repo.insert!(%Gis.GisObjectType{ot_name: h, ot_params: %{}, gisiconsets_id: iconset.id})
                import_objecttypes(t, iconset, [obj_type|types])
            [] -> types
        end
    end

    # go_id, go_description, go_attributes, go_enabled, go_angle, go_position, gisobjecttype_id

    def import_objects(object_types, objects_per_map, boundary) do
        all_objects = import_objects(object_types, objects_per_map, boundary, [])
        all_objects
    end

    def import_objects(object_types, objects_per_map, boundary, all_objects) do
        case object_types do
            [h|t] ->  
                items_per_type = div objects_per_map, length(object_types)
                objects = import_objects(h, objects_per_map, boundary, items_per_type, 0, [])
                import_objects(t, objects_per_map, boundary, objects ++ all_objects)
            [] -> 
                IO.puts(length(all_objects))
                all_objects
        end
    end

    def import_objects(objtype, objects_per_map, boundary, items_per_type, items_count, objects) do
        :random.seed(:erlang.now())
        if items_count < items_per_type do
            position = get_point_from_bounary(boundary) 
            go_id = :random.uniform(1000000)
            go_angle = Float.ceil(:random.uniform() * 360, 2)
            object = Gis.Repo.insert!(%Gis.GisObject{go_id: go_id, go_name: "#{objtype.ot_name}: #{go_id}",
                                                     go_description: "Test Description",
                                                     go_attributes: %{}, go_enabled: true, go_angle: go_angle,
                                                     go_position: position, gisobjecttypes_id: objtype.id})
            import_objects(objtype, objects_per_map, boundary, items_per_type, items_count + 1, [object|objects])
        else
            objects
        end
                
    end


# ovl_name, ovl_description, ovl_icon, ovl_attributes, ovl_type, inserted_at, updated_at, 
# gisoverlayersets_id
    def import_overlayer(name, ovl_set, map_boundary) do
        image_url = "http://almaqam.net/images/black-opacity-80.png"
        ovl_boudary = get_boundary(map_boundary)
        bounds = [%{"latmin" => Map.get(ovl_boudary, :latmin), "lonmin" => Map.get(ovl_boudary, :lonmin)},
                  %{"latmax" => Map.get(ovl_boudary, :latmax), "lonmax" => Map.get(ovl_boudary, :lonmax)}]
        overlayer = Gis.Repo.insert!(%Gis.GisOverlayer{ovl_name: name, ovl_description: "Overlayer test descritpion",
                                                       ovl_icon: "icon.png", 
                                                       ovl_attributes: %{"bounds" => bounds, "image_url" => image_url},
                                                       ovl_type: "Graphical",
                                                       gis_overlayer_set_id: ovl_set.id
                                                      }
                                    )
    end


end

Seeds.import_data(map_data, object_types, m, m_per_ms, angle_variation, objects_per_map, map_types)