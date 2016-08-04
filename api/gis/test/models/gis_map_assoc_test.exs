defmodule Gis.GisMapAssocTest do
  use Gis.ModelCase

  alias Gis.GisMapAssoc

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisMapAssoc.changeset(%GisMapAssoc{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisMapAssoc.changeset(%GisMapAssoc{}, @invalid_attrs)
    refute changeset.valid?
  end
end
