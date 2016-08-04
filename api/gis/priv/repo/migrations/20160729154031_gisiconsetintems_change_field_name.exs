defmodule Gis.Repo.Migrations.GisiconsetintemsChangeFieldName do
  use Ecto.Migration

  def change do
      rename table(:gisiconsetitems), :icon_set_id, to: :gis_icon_set_id
  end
end
