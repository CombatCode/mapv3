defmodule Gis.Repo.Migrations.GismapsAddOverlaysetId do
  use Ecto.Migration

  def change do
    alter table(:gismaps) do
      add :gisoverlayersets_id, references(:gisoverlayersets)
    end
  end
end
