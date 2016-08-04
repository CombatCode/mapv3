defmodule Gis.Repo.Migrations.GisobjectsAddNameField do
  use Ecto.Migration

  def change do
    alter table(:gisobjects) do
      add :go_name, :string
    end
  end
end
