defmodule Gis.Repo.Migrations.CreateGisIconSetItem do
  use Ecto.Migration

  def change do
    create table(:gisiconsetitems) do
      add :icon_name, :string
      add :icon_image, :string
      add :icon_set_id, references(:gisiconsets, on_delete: :nothing)

      timestamps()
    end
    create index(:gisiconsetitems, [:icon_set_id])

  end
end
