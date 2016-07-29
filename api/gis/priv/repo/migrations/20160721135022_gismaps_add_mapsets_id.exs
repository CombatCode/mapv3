defmodule Gis.Repo.Migrations.GismapsAddMapsetsId do
  use Ecto.Migration

  def change do
    alter table(:gismaps) do
      add :gismapsets_id, references(:gismapsets)
    end
  end
end
