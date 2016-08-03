defmodule Gis.GisIconSetItemTest do
  use Gis.ModelCase

  alias Gis.GisIconSetItem

  @valid_attrs %{icon_image: "some content", icon_name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisIconSetItem.changeset(%GisIconSetItem{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisIconSetItem.changeset(%GisIconSetItem{}, @invalid_attrs)
    refute changeset.valid?
  end
end
