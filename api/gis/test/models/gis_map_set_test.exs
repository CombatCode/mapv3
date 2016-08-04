defmodule Gis.GisMapSetTest do
  use Gis.ModelCase

  alias Gis.GisMapSet

  @valid_attrs %{ms_name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisMapSet.changeset(%GisMapSet{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisMapSet.changeset(%GisMapSet{}, @invalid_attrs)
    refute changeset.valid?
  end
end
