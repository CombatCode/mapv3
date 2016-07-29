defmodule Gis.GisMapSet do
  use Gis.Web, :model

@derive {Poison.Encoder, only: [:id, :ms_name, :ms_equal]}

  schema "gismapsets" do
    field :ms_name, :string
    field :ms_equal, :boolean
    has_many :gismaps, Gis.GisMap
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:ms_name])
    |> validate_required([:ms_name])
  end
end
