defmodule Gis.GisObjectTest do
  use Gis.ModelCase

  alias Gis.GisObject

  @valid_attrs %{go_angle: "120.5", go_attributes: %{}, go_description: "some content", go_enabled: true, go_id: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GisObject.changeset(%GisObject{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GisObject.changeset(%GisObject{}, @invalid_attrs)
    refute changeset.valid?
  end
end
