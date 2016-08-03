defmodule Gis.GisObject do
  use Gis.Web, :model

  schema "gisobjects" do
    field :go_id, :integer
    field :go_name, :string
    field :go_description, :string
    field :go_attributes, :map
    field :go_enabled, :boolean, default: false
    field :go_angle, :float
    field :go_position, Geo.Geometry
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
