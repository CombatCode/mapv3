defmodule Gis.GisObjectTypeTest do
  use Gis.ModelCase

  alias Gis.GisObjectType

  @valid_attrs %{ot_name: "some content", ot_params: %{}}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisObjectType.changeset(%GisObjectType{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisObjectType.changeset(%GisObjectType{}, @invalid_attrs)
    refute changeset.valid?
  end
end
