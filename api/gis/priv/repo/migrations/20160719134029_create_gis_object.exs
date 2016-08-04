defmodule Gis.Repo.Migrations.CreateGisObject do
  use Ecto.Migration
 
  def up do
    execute "CREATE EXTENSION IF NOT EXISTS postgis"
    create table(:gisobjects) do
      add :go_id, :integer
      add :go_description, :text
      add :go_attributes, :map
      add :go_enabled, :boolean, default: false, null: false
      add :go_angle, :float

      timestamps()
    end
  end

  def down do
    drop table(:gisobjects)
  end
end
