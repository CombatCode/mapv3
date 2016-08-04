defmodule Gis.GisIconSet do
  use Gis.Web, :model

  schema "gisiconsets" do
    field :iset_name, :string
    field :iset_category, :string
    has_many :gisiconsetitems, Gis.GisIconSetItem
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:iset_name, :iset_category])
    |> validate_required([:iset_name, :iset_category])
  end
end
