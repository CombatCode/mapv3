defmodule Gis.Repo.Migrations.OverlayersetChangeName do
  use Ecto.Migration

  def change do
    # olvs_name, ovls_params, ovls_order	
      rename table(:gisoverlayersets), :olvs_name, to: :ovls_name
  end
end
