defmodule Gis.GisOverlayerSetTest do
  use Gis.ModelCase

  alias Gis.GisOverlayerSet

  @valid_attrs %{olvs_name: "some content", ovls_order: 42, ovls_params: %{}}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisOverlayerSet.changeset(%GisOverlayerSet{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisOverlayerSet.changeset(%GisOverlayerSet{}, @invalid_attrs)
    refute changeset.valid?
  end
end
