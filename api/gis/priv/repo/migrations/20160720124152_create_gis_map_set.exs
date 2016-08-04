defmodule Gis.Repo.Migrations.CreateGisMapSet do
  use Ecto.Migration

  def change do
    create table(:gismapsets) do
      add :ms_name, :string

      timestamps()
    end

  end
end
