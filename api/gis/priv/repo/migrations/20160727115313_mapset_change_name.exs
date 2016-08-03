defmodule Gis.Repo.Migrations.MapsetChangeName do
  use Ecto.Migration

  def change do
      rename table(:gismapsets), :is_equal, to: :ms_equal
  end
end
