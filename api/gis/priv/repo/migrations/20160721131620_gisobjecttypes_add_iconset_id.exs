defmodule Gis.Repo.Migrations.GisobjecttypesAddIconsetId do
  use Ecto.Migration

  def change do
    alter table(:gisobjecttypes) do
      add :gisiconsets_id, references(:gisiconsets)
    end
  end
end
