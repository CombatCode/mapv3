defmodule Gis.GisOverlayer do
  use Gis.Web, :model

  @derive [Poison.Encoder]

  schema "gisoverlayers" do
    field :ovl_name, :string
    field :ovl_description, :string
    field :ovl_icon, :string
    field :ovl_attributes, :map
    field :ovl_type, :string
    belongs_to :gisoverlayersets, Gis.GisOverlayerSet
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:ovl_name, :ovl_description, :ovl_icon, :ovl_attributes, :ovl_type])
    |> validate_required([:ovl_name, :ovl_description, :ovl_icon, :ovl_attributes, :ovl_type])
  end
end
