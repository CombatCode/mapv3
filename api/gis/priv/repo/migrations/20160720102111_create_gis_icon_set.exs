defmodule Gis.Repo.Migrations.CreateGisIconSet do
  use Ecto.Migration

  def change do
    create table(:gisiconsets) do
      add :iset_name, :string
      add :iset_category, :string

      timestamps()
    end

  end
end
