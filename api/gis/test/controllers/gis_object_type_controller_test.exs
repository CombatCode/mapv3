defmodule Gis.GisObjectTypeControllerTest do
  use Gis.ConnCase

  alias Gis.GisObjectType
  @valid_attrs %{ot_name: "some content", ot_params: %{}}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, gis_object_type_path(conn, :index)
    assert html_response(conn, 200) =~ "Listing gisobjecttypes"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, gis_object_type_path(conn, :new)
    assert html_response(conn, 200) =~ "New gis object type"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, gis_object_type_path(conn, :create), gis_object_type: @valid_attrs
    assert redirected_to(conn) == gis_object_type_path(conn, :index)
    assert Repo.get_by(GisObjectType, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, gis_object_type_path(conn, :create), gis_object_type: @invalid_attrs
    assert html_response(conn, 200) =~ "New gis object type"
  end

  test "shows chosen resource", %{conn: conn} do
    gis_object_type = Repo.insert! %GisObjectType{}
    conn = get conn, gis_object_type_path(conn, :show, gis_object_type)
    assert html_response(conn, 200) =~ "Show gis object type"
  end

  test "renders page not found when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, gis_object_type_path(conn, :show, -1)
    end
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    gis_object_type = Repo.insert! %GisObjectType{}
    conn = get conn, gis_object_type_path(conn, :edit, gis_object_type)
    assert html_response(conn, 200) =~ "Edit gis object type"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    gis_object_type = Repo.insert! %GisObjectType{}
    conn = put conn, gis_object_type_path(conn, :update, gis_object_type), gis_object_type: @valid_attrs
    assert redirected_to(conn) == gis_object_type_path(conn, :show, gis_object_type)
    assert Repo.get_by(GisObjectType, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    gis_object_type = Repo.insert! %GisObjectType{}
    conn = put conn, gis_object_type_path(conn, :update, gis_object_type), gis_object_type: @invalid_attrs
    assert html_response(conn, 200) =~ "Edit gis object type"
  end

  test "deletes chosen resource", %{conn: conn} do
    gis_object_type = Repo.insert! %GisObjectType{}
    conn = delete conn, gis_object_type_path(conn, :delete, gis_object_type)
    assert redirected_to(conn) == gis_object_type_path(conn, :index)
    refute Repo.get(GisObjectType, gis_object_type.id)
  end
end
