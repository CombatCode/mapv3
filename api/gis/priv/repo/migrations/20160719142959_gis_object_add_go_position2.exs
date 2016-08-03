defmodule Gis.Repo.Migrations.GisObjectAddGoPosition2 do
  use Ecto.Migration

  def change do
    alter table(:gisobjects) do
        add :go_position, :geometry
    end
  end
end
