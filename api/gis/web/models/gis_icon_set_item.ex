defmodule Gis.GisIconSetItem do
  use Gis.Web, :model

  schema "gisiconsetitems" do
    field :icon_name, :string
    field :icon_image, :string
    belongs_to :icon_set, Gis.GisIconSet

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:icon_name, :icon_image])
    |> validate_required([:icon_name, :icon_image])
  end
end
