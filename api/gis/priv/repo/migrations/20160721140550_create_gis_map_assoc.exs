defmodule Gis.Repo.Migrations.CreateGisMapAssoc do
  use Ecto.Migration

  def change do
    create table(:gismapassocs) do
      add :gismaps_id, references(:gismaps)
      add :gisobjects_id, references(:gisobjects)
      timestamps()
    end

  end
end
