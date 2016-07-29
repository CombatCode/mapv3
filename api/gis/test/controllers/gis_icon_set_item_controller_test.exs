defmodule Gis.GisIconSetItemControllerTest do
  use Gis.ConnCase

  alias Gis.GisIconSetItem
  @valid_attrs %{icon_image: "some content", icon_name: "some content"}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, gis_icon_set_item_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing gisiconsetitems"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, gis_icon_set_item_path(conn, :new)
    assert html_response(conn, 200) =~ "New gis icon set item"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, gis_icon_set_item_path(conn, :create), gis_icon_set_item: @valid_attrs
    assert redirected_to(conn) == gis_icon_set_item_path(conn, :index)
    assert Repo.get_by(GisIconSetItem, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, gis_icon_set_item_path(conn, :create), gis_icon_set_item: @invalid_attrs
    assert html_response(conn, 200) =~ "New gis icon set item"
  end

  test "shows chosen resource", %{conn: conn} do
    gis_icon_set_item = Repo.insert! %GisIconSetItem{}
    conn = get conn, gis_icon_set_item_path(conn, :show, gis_icon_set_item)
    assert html_response(conn, 200) =~ "Show gis icon set item"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, gis_icon_set_item_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    gis_icon_set_item = Repo.insert! %GisIconSetItem{}
    conn = get conn, gis_icon_set_item_path(conn, :edit, gis_icon_set_item)
    assert html_response(conn, 200) =~ "Edit gis icon set item"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    gis_icon_set_item = Repo.insert! %GisIconSetItem{}
    conn = put conn, gis_icon_set_item_path(conn, :update, gis_icon_set_item), gis_icon_set_item: @valid_attrs
    assert redirected_to(conn) == gis_icon_set_item_path(conn, :show, gis_icon_set_item)
    assert Repo.get_by(GisIconSetItem, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    gis_icon_set_item = Repo.insert! %GisIconSetItem{}
    conn = put conn, gis_icon_set_item_path(conn, :update, gis_icon_set_item), gis_icon_set_item: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit gis icon set item"
  end

  test "deletes chosen resource", %{conn: conn} do
    gis_icon_set_item = Repo.insert! %GisIconSetItem{}
    conn = delete conn, gis_icon_set_item_path(conn, :delete, gis_icon_set_item)
    assert redirected_to(conn) == gis_icon_set_item_path(conn, :index)
    refute Repo.get(GisIconSetItem, gis_icon_set_item.id)
  end
end
