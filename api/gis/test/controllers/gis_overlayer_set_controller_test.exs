defmodule Gis.GisOverlayerSetControllerTest do
  use Gis.ConnCase

  alias Gis.GisOverlayerSet
  @valid_attrs %{olvs_name: "some content", ovls_order: 42, ovls_params: %{}}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, gis_overlayer_set_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing gisoverlayersets"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, gis_overlayer_set_path(conn, :new)
    assert html_response(conn, 200) =~ "New gis overlayer set"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, gis_overlayer_set_path(conn, :create), gis_overlayer_set: @valid_attrs
    assert redirected_to(conn) == gis_overlayer_set_path(conn, :index)
    assert Repo.get_by(GisOverlayerSet, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, gis_overlayer_set_path(conn, :create), gis_overlayer_set: @invalid_attrs
    assert html_response(conn, 200) =~ "New gis overlayer set"
  end

  test "shows chosen resource", %{conn: conn} do
    gis_overlayer_set = Repo.insert! %GisOverlayerSet{}
    conn = get conn, gis_overlayer_set_path(conn, :show, gis_overlayer_set)
    assert html_response(conn, 200) =~ "Show gis overlayer set"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, gis_overlayer_set_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    gis_overlayer_set = Repo.insert! %GisOverlayerSet{}
    conn = get conn, gis_overlayer_set_path(conn, :edit, gis_overlayer_set)
    assert html_response(conn, 200) =~ "Edit gis overlayer set"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    gis_overlayer_set = Repo.insert! %GisOverlayerSet{}
    conn = put conn, gis_overlayer_set_path(conn, :update, gis_overlayer_set), gis_overlayer_set: @valid_attrs
    assert redirected_to(conn) == gis_overlayer_set_path(conn, :show, gis_overlayer_set)
    assert Repo.get_by(GisOverlayerSet, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    gis_overlayer_set = Repo.insert! %GisOverlayerSet{}
    conn = put conn, gis_overlayer_set_path(conn, :update, gis_overlayer_set), gis_overlayer_set: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit gis overlayer set"
  end

  test "deletes chosen resource", %{conn: conn} do
    gis_overlayer_set = Repo.insert! %GisOverlayerSet{}
    conn = delete conn, gis_overlayer_set_path(conn, :delete, gis_overlayer_set)
    assert redirected_to(conn) == gis_overlayer_set_path(conn, :index)
    refute Repo.get(GisOverlayerSet, gis_overlayer_set.id)
  end
end
