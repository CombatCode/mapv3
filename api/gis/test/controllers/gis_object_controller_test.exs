defmodule Gis.GisObjectControllerTest do
  use Gis.ConnCase

  alias Gis.GisObject
  @valid_attrs %{go_angle: "120.5", go_attributes: %{}, go_description: "some content", go_enabled: true, go_id: 42}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, gis_object_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing gisobjects"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, gis_object_path(conn, :new)
    assert html_response(conn, 200) =~ "New gis object"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, gis_object_path(conn, :create), gis_object: @valid_attrs
    assert redirected_to(conn) == gis_object_path(conn, :index)
    assert Repo.get_by(GisObject, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, gis_object_path(conn, :create), gis_object: @invalid_attrs
    assert html_response(conn, 200) =~ "New gis object"
  end

  test "shows chosen resource", %{conn: conn} do
    gis_object = Repo.insert! %GisObject{}
    conn = get conn, gis_object_path(conn, :show, gis_object)
    assert html_response(conn, 200) =~ "Show gis object"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, gis_object_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    gis_object = Repo.insert! %GisObject{}
    conn = get conn, gis_object_path(conn, :edit, gis_object)
    assert html_response(conn, 200) =~ "Edit gis object"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    gis_object = Repo.insert! %GisObject{}
    conn = put conn, gis_object_path(conn, :update, gis_object), gis_object: @valid_attrs
    assert redirected_to(conn) == gis_object_path(conn, :show, gis_object)
    assert Repo.get_by(GisObject, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    gis_object = Repo.insert! %GisObject{}
    conn = put conn, gis_object_path(conn, :update, gis_object), gis_object: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit gis object"
  end

  test "deletes chosen resource", %{conn: conn} do
    gis_object = Repo.insert! %GisObject{}
    conn = delete conn, gis_object_path(conn, :delete, gis_object)
    assert redirected_to(conn) == gis_object_path(conn, :index)
    refute Repo.get(GisObject, gis_object.id)
  end
end
