defmodule Gis.Repo.Migrations.CreateGisObjectType do
  use Ecto.Migration

  def change do
    create table(:gisobjecttypes) do
      add :ot_name, :string
      add :ot_params, :map

      timestamps()
    end

  end
end
