defmodule Gis.GisMapAssocControllerTest do
  use Gis.ConnCase

  alias Gis.GisMapAssoc
  @valid_attrs %{}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, gis_map_assoc_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing gismapassocs"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, gis_map_assoc_path(conn, :new)
    assert html_response(conn, 200) =~ "New gis map assoc"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, gis_map_assoc_path(conn, :create), gis_map_assoc: @valid_attrs
    assert redirected_to(conn) == gis_map_assoc_path(conn, :index)
    assert Repo.get_by(GisMapAssoc, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, gis_map_assoc_path(conn, :create), gis_map_assoc: @invalid_attrs
    assert html_response(conn, 200) =~ "New gis map assoc"
  end

  test "shows chosen resource", %{conn: conn} do
    gis_map_assoc = Repo.insert! %GisMapAssoc{}
    conn = get conn, gis_map_assoc_path(conn, :show, gis_map_assoc)
    assert html_response(conn, 200) =~ "Show gis map assoc"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, gis_map_assoc_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    gis_map_assoc = Repo.insert! %GisMapAssoc{}
    conn = get conn, gis_map_assoc_path(conn, :edit, gis_map_assoc)
    assert html_response(conn, 200) =~ "Edit gis map assoc"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    gis_map_assoc = Repo.insert! %GisMapAssoc{}
    conn = put conn, gis_map_assoc_path(conn, :update, gis_map_assoc), gis_map_assoc: @valid_attrs
    assert redirected_to(conn) == gis_map_assoc_path(conn, :show, gis_map_assoc)
    assert Repo.get_by(GisMapAssoc, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    gis_map_assoc = Repo.insert! %GisMapAssoc{}
    conn = put conn, gis_map_assoc_path(conn, :update, gis_map_assoc), gis_map_assoc: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit gis map assoc"
  end

  test "deletes chosen resource", %{conn: conn} do
    gis_map_assoc = Repo.insert! %GisMapAssoc{}
    conn = delete conn, gis_map_assoc_path(conn, :delete, gis_map_assoc)
    assert redirected_to(conn) == gis_map_assoc_path(conn, :index)
    refute Repo.get(GisMapAssoc, gis_map_assoc.id)
  end
end
