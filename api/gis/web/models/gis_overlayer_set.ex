defmodule Gis.GisOverlayerSet do
  use Gis.Web, :model

  schema "gisoverlayersets" do
    field :ovls_name, :string
    field :ovls_params, :map
    field :ovls_order, :integer
    has_many :gismaps, Gis.GisMap
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:olvs_name, :ovls_params, :ovls_order])
    |> validate_required([:olvs_name, :ovls_params, :ovls_order])
  end
end
