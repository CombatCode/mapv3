defmodule Gis.Repo.Migrations.OverlayersChangeGisoverlayersetsIdName do
  use Ecto.Migration

  def change do
      rename table(:gisoverlayers), :gisoverlayersets_id, to: :gis_overlayer_set_id
  end
end
