defmodule Gis.Router do
  use Gis.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Gis do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    resources "/gisobjects", GisObjectController
    resources "/gisiconsets", GisIconSetController
    resources "/gisiconsetitems", GisIconSetItemController
    resources "/gisoverlayer", GisOverlayerController
    resources "/gismapsets", GisMapSetController
    resources "/gismaps", GisMapController
    resources "/gisobjecttypes", GisObjectTypeController
    resources "/gisoverlayersets", GisOverlayerSetController
    resources "/gismapassocs", GisMapAssocController
  end

  # Other scopes may use custom stacks.
    scope "/api", Gis do
      pipe_through :api

      get "/mapsets/", Api.MapSetsController, :index
      get "/mapsets/:id", Api.MapSetsController, :show
      get "/maps/:id", Api.MapsController, :show
      get "/overlayersets/:id", Api.OverlayerSetsController, :index
      get "/overlayer/:id", Api.OverlayersController, :show
      get "/objects/:id" , Api.ObjectsController, :index
      # get "/objects/:id/:latmin/:lonmin/:latmax/:lonmax", Api.ObjectsController, :on_map
    end
end
