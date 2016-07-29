defmodule Gis.GisMapControllerTest do
  use Gis.ConnCase

  alias Gis.GisMap
  @valid_attrs %{map_default: true, map_features: %{}, map_name: "some content", map_zoom: %{}}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, gis_map_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing gismaps"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, gis_map_path(conn, :new)
    assert html_response(conn, 200) =~ "New gis map"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, gis_map_path(conn, :create), gis_map: @valid_attrs
    assert redirected_to(conn) == gis_map_path(conn, :index)
    assert Repo.get_by(GisMap, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, gis_map_path(conn, :create), gis_map: @invalid_attrs
    assert html_response(conn, 200) =~ "New gis map"
  end

  test "shows chosen resource", %{conn: conn} do
    gis_map = Repo.insert! %GisMap{}
    conn = get conn, gis_map_path(conn, :show, gis_map)
    assert html_response(conn, 200) =~ "Show gis map"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, gis_map_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    gis_map = Repo.insert! %GisMap{}
    conn = get conn, gis_map_path(conn, :edit, gis_map)
    assert html_response(conn, 200) =~ "Edit gis map"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    gis_map = Repo.insert! %GisMap{}
    conn = put conn, gis_map_path(conn, :update, gis_map), gis_map: @valid_attrs
    assert redirected_to(conn) == gis_map_path(conn, :show, gis_map)
    assert Repo.get_by(GisMap, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    gis_map = Repo.insert! %GisMap{}
    conn = put conn, gis_map_path(conn, :update, gis_map), gis_map: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit gis map"
  end

  test "deletes chosen resource", %{conn: conn} do
    gis_map = Repo.insert! %GisMap{}
    conn = delete conn, gis_map_path(conn, :delete, gis_map)
    assert redirected_to(conn) == gis_map_path(conn, :index)
    refute Repo.get(GisMap, gis_map.id)
  end
end
