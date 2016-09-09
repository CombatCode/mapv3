defmodule Gis.GisMapType do
  use Gis.Web, :model

  schema "gismaptypes" do
    field :map_type_geographic, :boolean, default: true
    field :map_type_name, :string
    field :map_type_attributes, :map
    has_many :gismaps, Gis.GisMap
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:map_type_name, :map_type_attributes])
    |> validate_required([:map_type_name, :map_type_attributes])
  end
end
