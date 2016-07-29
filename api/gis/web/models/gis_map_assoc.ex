defmodule Gis.GisMapAssoc do
  use Gis.Web, :model

  schema "gismapassocs" do
    belongs_to :gismaps, Gis.GisMaps
    belongs_to :gisobjects, Gis.GisObjects
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
    |> validate_required([])
  end
end
