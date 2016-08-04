defmodule Gis.Repo.Migrations.MapChangeName do
  use Ecto.Migration

  def change do
          rename table(:gismaps), :map_features, to: :map_attributes
  end
end
