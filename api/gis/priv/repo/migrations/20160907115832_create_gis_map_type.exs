defmodule Gis.Repo.Migrations.CreateGisMapType do
  use Ecto.Migration

  def change do
    create table(:gismaptypes) do
      add :map_type_name, :string
      add :map_type_attributes, :map

      timestamps()
    end

  end
end
