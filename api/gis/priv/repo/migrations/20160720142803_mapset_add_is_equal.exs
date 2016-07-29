defmodule Gis.Repo.Migrations.MapsetAddIsEqual do
  use Ecto.Migration

  def change do
    alter table(:gismapsets) do
      add :is_equal, :boolean
    end
  end
end
