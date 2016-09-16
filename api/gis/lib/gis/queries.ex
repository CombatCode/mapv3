defmodule Gis.Queries do
  import Ecto.Query

  alias Gis.GisObjects

  def all_objects() do
      query = from Gis.GisObject, preload: :gisobjecttypes

      Gis.Repo.all(query)
  end
end

