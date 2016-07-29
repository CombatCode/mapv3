defmodule Gis.GisOverlayerControllerTest do
  use Gis.ConnCase

  alias Gis.GisOverlayer
  @valid_attrs %{ovl_attributes: %{}, ovl_description: "some content", ovl_icon: "some content", ovl_name: "some content", ovl_type: "some content"}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, gis_overlayer_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing gisoverlayer"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, gis_overlayer_path(conn, :new)
    assert html_response(conn, 200) =~ "New gis overlayer"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, gis_overlayer_path(conn, :create), gis_overlayer: @valid_attrs
    assert redirected_to(conn) == gis_overlayer_path(conn, :index)
    assert Repo.get_by(GisOverlayer, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, gis_overlayer_path(conn, :create), gis_overlayer: @invalid_attrs
    assert html_response(conn, 200) =~ "New gis overlayer"
  end

  test "shows chosen resource", %{conn: conn} do
    gis_overlayer = Repo.insert! %GisOverlayer{}
    conn = get conn, gis_overlayer_path(conn, :show, gis_overlayer)
    assert html_response(conn, 200) =~ "Show gis overlayer"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, gis_overlayer_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    gis_overlayer = Repo.insert! %GisOverlayer{}
    conn = get conn, gis_overlayer_path(conn, :edit, gis_overlayer)
    assert html_response(conn, 200) =~ "Edit gis overlayer"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    gis_overlayer = Repo.insert! %GisOverlayer{}
    conn = put conn, gis_overlayer_path(conn, :update, gis_overlayer), gis_overlayer: @valid_attrs
    assert redirected_to(conn) == gis_overlayer_path(conn, :show, gis_overlayer)
    assert Repo.get_by(GisOverlayer, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    gis_overlayer = Repo.insert! %GisOverlayer{}
    conn = put conn, gis_overlayer_path(conn, :update, gis_overlayer), gis_overlayer: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit gis overlayer"
  end

  test "deletes chosen resource", %{conn: conn} do
    gis_overlayer = Repo.insert! %GisOverlayer{}
    conn = delete conn, gis_overlayer_path(conn, :delete, gis_overlayer)
    assert redirected_to(conn) == gis_overlayer_path(conn, :index)
    refute Repo.get(GisOverlayer, gis_overlayer.id)
  end
end
