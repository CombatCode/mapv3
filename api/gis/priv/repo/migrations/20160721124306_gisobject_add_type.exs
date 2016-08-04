defmodule Gis.Repo.Migrations.GisobjectAddType do
  use Ecto.Migration

  def change do
    alter table(:gisobjects) do
      add :gisobjecttypes_id, references(:gisobjecttypes)
    end
  end
end
