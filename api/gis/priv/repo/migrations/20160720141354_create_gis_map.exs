defmodule Gis.Repo.Migrations.CreateGisMap do
  use Ecto.Migration

  def change do
    create table(:gismaps) do
      add :map_name, :string
      add :map_zoom, :map
      add :map_features, :map
      add :map_default, :boolean, default: false, null: false

      timestamps()
    end

  end
end
