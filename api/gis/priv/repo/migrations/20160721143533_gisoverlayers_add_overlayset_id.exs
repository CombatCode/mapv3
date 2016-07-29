defmodule Gis.Repo.Migrations.GisoverlayersAddOverlaysetId do
  use Ecto.Migration

  def change do
    alter table(:gisoverlayers) do
      add :gisoverlayersets_id, references(:gisoverlayersets)
    end
  end
end
