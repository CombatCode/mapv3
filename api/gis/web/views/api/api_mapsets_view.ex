defmodule Gis.Api.MapSetsView do
  use Gis.Web, :view

  def render("index.json", %{data: data}) do
      data
  end

  def render("show.json", %{data: data}) do
      data
  end
end