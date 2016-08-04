defmodule Gis.GisMapSetControllerTest do
  use Gis.ConnCase

  alias Gis.GisMapSet
  @valid_attrs %{ms_name: "some content"}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, gis_map_set_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing gismapsets"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, gis_map_set_path(conn, :new)
    assert html_response(conn, 200) =~ "New gis map set"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, gis_map_set_path(conn, :create), gis_map_set: @valid_attrs
    assert redirected_to(conn) == gis_map_set_path(conn, :index)
    assert Repo.get_by(GisMapSet, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, gis_map_set_path(conn, :create), gis_map_set: @invalid_attrs
    assert html_response(conn, 200) =~ "New gis map set"
  end

  test "shows chosen resource", %{conn: conn} do
    gis_map_set = Repo.insert! %GisMapSet{}
    conn = get conn, gis_map_set_path(conn, :show, gis_map_set)
    assert html_response(conn, 200) =~ "Show gis map set"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, gis_map_set_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    gis_map_set = Repo.insert! %GisMapSet{}
    conn = get conn, gis_map_set_path(conn, :edit, gis_map_set)
    assert html_response(conn, 200) =~ "Edit gis map set"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    gis_map_set = Repo.insert! %GisMapSet{}
    conn = put conn, gis_map_set_path(conn, :update, gis_map_set), gis_map_set: @valid_attrs
    assert redirected_to(conn) == gis_map_set_path(conn, :show, gis_map_set)
    assert Repo.get_by(GisMapSet, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    gis_map_set = Repo.insert! %GisMapSet{}
    conn = put conn, gis_map_set_path(conn, :update, gis_map_set), gis_map_set: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit gis map set"
  end

  test "deletes chosen resource", %{conn: conn} do
    gis_map_set = Repo.insert! %GisMapSet{}
    conn = delete conn, gis_map_set_path(conn, :delete, gis_map_set)
    assert redirected_to(conn) == gis_map_set_path(conn, :index)
    refute Repo.get(GisMapSet, gis_map_set.id)
  end
end
