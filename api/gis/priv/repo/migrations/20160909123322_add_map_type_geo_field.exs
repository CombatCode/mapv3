defmodule Gis.Repo.Migrations.AddMapTypeGeoField do
  use Ecto.Migration

  def change do
    alter table(:gismaptypes) do
      add :map_type_geographic, :boolean, default: true
    end
  end
end
