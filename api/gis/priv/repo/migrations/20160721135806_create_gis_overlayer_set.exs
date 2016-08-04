defmodule Gis.Repo.Migrations.CreateGisOverlayerSet do
  use Ecto.Migration

  def change do
    create table(:gisoverlayersets) do
      add :olvs_name, :string
      add :ovls_params, :map
      add :ovls_order, :integer

      timestamps()
    end

  end
end
