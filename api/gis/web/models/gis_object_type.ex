defmodule Gis.GisObjectType do
  use Gis.Web, :model

  schema "gisobjecttypes" do
    field :ot_name, :string
    field :ot_params, :map
    has_many :gisobjects, Gis.GisObject
    belongs_to :gisiconsets, Gis.GisIconSet
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:ot_name, :ot_params])
    |> validate_required([:ot_name, :ot_params])
  end
end
