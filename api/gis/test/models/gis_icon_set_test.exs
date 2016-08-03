defmodule Gis.GisIconSetTest do
  use Gis.ModelCase

  alias Gis.GisIconSet

  @valid_attrs %{iset_category: "some content", iset_name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisIconSet.changeset(%GisIconSet{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisIconSet.changeset(%GisIconSet{}, @invalid_attrs)
    refute changeset.valid?
  end
end
