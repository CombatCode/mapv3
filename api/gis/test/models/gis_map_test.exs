defmodule Gis.GisMapTest do
  use Gis.ModelCase

  alias Gis.GisMap

  @valid_attrs %{map_default: true, map_features: %{}, map_name: "some content", map_zoom: %{}}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisMap.changeset(%GisMap{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisMap.changeset(%GisMap{}, @invalid_attrs)
    refute changeset.valid?
  end
end
