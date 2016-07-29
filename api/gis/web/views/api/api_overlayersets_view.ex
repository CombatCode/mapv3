defmodule Gis.Api.OverlayerSetsView do
  use Gis.Web, :view

  def render("show.json", %{data: data}) do
      data
  end
end