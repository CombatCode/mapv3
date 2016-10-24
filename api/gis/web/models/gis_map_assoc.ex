defmodule Gis.GisMapAssoc do
  use Gis.Web, :model

  schema "gismapassocs" do
    belongs_to :gismaps, Gis.GisMaps, foreign_key: :gis_map_id
    belongs_to :gisobjects, Gis.GisObject, foreign_key: :gis_object_id
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
