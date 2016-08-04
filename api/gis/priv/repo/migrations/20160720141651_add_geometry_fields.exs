defmodule Gis.Repo.Migrations.AddGeometryFields do
  use Ecto.Migration

  def change do
    alter table(:gismaps) do
        add :map_geographic, :boolean
        add :map_center, :geometry
        add :map_max_extent, :geometry
        add :map_restricted_extent, :geometry
    end
  end
end
