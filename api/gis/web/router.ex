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
      get "/mapsets/:ms_id/maps/", Api.MapSetsController, :show
      get "/mapsets/:ms_id/maps/:map_id", Api.MapsController, :show
      get "/mapsets/:ms_id/maps/:map_id/features" , Api.ObjectsController, :index
      get "/mapsets/:ms_id/maps/:map_id/overlayersets/", Api.OverlayerSetsController, :show
      get "/mapsets/:ms_id/maps/:map_id/overlayersets/:ovs_id/overlayers", Api.OverlayersController, :show
      get "/mapsets/:ms_id/maps/:map_id/features/:latmin/:lonmin/:latmax/:lonmax", Api.ObjectsController, :on_map
      get "/objecttypes/", Api.ObjectTypesController, :index
    end
    
    # socket "/ws", Gis do
    #   channel "rooms:*", RoomChannel
    # end
end
