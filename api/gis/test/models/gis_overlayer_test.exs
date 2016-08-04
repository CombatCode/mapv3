defmodule Gis.GisOverlayerTest do
  use Gis.ModelCase

  alias Gis.GisOverlayer

  @valid_attrs %{ovl_attributes: %{}, ovl_description: "some content", ovl_icon: "some content", ovl_name: "some content", ovl_type: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisOverlayer.changeset(%GisOverlayer{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisOverlayer.changeset(%GisOverlayer{}, @invalid_attrs)
    refute changeset.valid?
  end
end
