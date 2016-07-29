defmodule Gis.Repo.Migrations.CreateGisOverlayer do
  use Ecto.Migration

  def change do
    create table(:gisoverlayers) do
      add :ovl_name, :string
      add :ovl_description, :string
      add :ovl_icon, :string
      add :ovl_attributes, :map
      add :ovl_type, :string

      timestamps()
    end

  end
end
