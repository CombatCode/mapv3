defmodule Gis.GisObject do
  use Gis.Web, :model
  @moduledoc """
    Module GisObject is model responsible for handle all map object (marker) data.

    Fields: 
      - go_id: Identification number of gis object. Handle id from system object.
      - go_name: Name of map object. 
      - go_description: Description of map object. Should be moved to go_attributes.
      - go_attributes: JSONb fileds with all necessary/additional information about object.
      - go_enabled: Boolean with information about object status. 
      - go_angle: Angle of map object to map itself. Should be moved to go_attributes.
      - go_position: Geometry position from map object. 
   """

  schema "gisobjects" do
    field :go_id, :integer
    field :go_name, :string
    field :go_description, :string
    field :go_attributes, :map
    field :go_enabled, :boolean, default: false
    field :go_angle, :float
    field :go_position, Geo.Point
    belongs_to :gisobjecttypes, Gis.GisObjectType
    has_many :gismapassocs, Gis.GisMapAssoc
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:go_id, :go_description, :go_attributes, :go_enabled, :go_angle, :go_position])
    |> validate_required([:go_id, :go_description, :go_attributes, :go_enabled, :go_angle, :go_position])
  end

end
