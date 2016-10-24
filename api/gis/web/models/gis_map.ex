defmodule Gis.GisMap do
  use Gis.Web, :model

  @derive [Poison.Encoder]


  schema "gismaps" do
    field :map_name, :string
    field :map_zoom, :map
    field :map_attributes, :map
    field :map_default, :boolean, default: false
    field :map_center, Geo.Point
    field :map_max_extent, Geo.Geometry
    field :map_restricted_extent, Geo.Geometry
    belongs_to :gismaptypes, Gis.GisMapType
    belongs_to :gismapsets, Gis.GisMapSet, foreign_key: :gis_map_set_id
    belongs_to :gisoverlayersets, Gis.GisOverlayerSet
    has_many :gismapassocs, Gis.GisMapAssoc
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:map_name, :map_zoom, :map_attributes, :map_default])
    |> validate_required([:map_name, :map_zoom, :map_attributes, :map_default])
  end
end
