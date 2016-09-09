defmodule Gis.GisMapTypeTest do
  use Gis.ModelCase

  alias Gis.GisMapType

  @valid_attrs %{map_type_attributes: %{}, map_type_name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisMapType.changeset(%GisMapType{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisMapType.changeset(%GisMapType{}, @invalid_attrs)
    refute changeset.valid?
  end
end
