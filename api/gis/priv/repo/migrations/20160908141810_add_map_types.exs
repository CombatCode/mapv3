defmodule Gis.Repo.Migrations.AddMapTypes do
  use Ecto.Migration

  def change do
    alter table(:gismaps) do
      add :gismaptypes_id, references(:gismaptypes)
    end
  end
end
