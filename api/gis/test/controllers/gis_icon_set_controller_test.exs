defmodule Gis.GisIconSetControllerTest do
  use Gis.ConnCase

  alias Gis.GisIconSet
  @valid_attrs %{iset_category: "some content", iset_name: "some content"}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, gis_icon_set_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing gisiconsets"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, gis_icon_set_path(conn, :new)
    assert html_response(conn, 200) =~ "New gis icon set"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, gis_icon_set_path(conn, :create), gis_icon_set: @valid_attrs
    assert redirected_to(conn) == gis_icon_set_path(conn, :index)
    assert Repo.get_by(GisIconSet, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, gis_icon_set_path(conn, :create), gis_icon_set: @invalid_attrs
    assert html_response(conn, 200) =~ "New gis icon set"
  end

  test "shows chosen resource", %{conn: conn} do
    gis_icon_set = Repo.insert! %GisIconSet{}
    conn = get conn, gis_icon_set_path(conn, :show, gis_icon_set)
    assert html_response(conn, 200) =~ "Show gis icon set"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, gis_icon_set_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    gis_icon_set = Repo.insert! %GisIconSet{}
    conn = get conn, gis_icon_set_path(conn, :edit, gis_icon_set)
    assert html_response(conn, 200) =~ "Edit gis icon set"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    gis_icon_set = Repo.insert! %GisIconSet{}
    conn = put conn, gis_icon_set_path(conn, :update, gis_icon_set), gis_icon_set: @valid_attrs
    assert redirected_to(conn) == gis_icon_set_path(conn, :show, gis_icon_set)
    assert Repo.get_by(GisIconSet, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    gis_icon_set = Repo.insert! %GisIconSet{}
    conn = put conn, gis_icon_set_path(conn, :update, gis_icon_set), gis_icon_set: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit gis icon set"
  end

  test "deletes chosen resource", %{conn: conn} do
    gis_icon_set = Repo.insert! %GisIconSet{}
    conn = delete conn, gis_icon_set_path(conn, :delete, gis_icon_set)
    assert redirected_to(conn) == gis_icon_set_path(conn, :index)
    refute Repo.get(GisIconSet, gis_icon_set.id)
  end
end
