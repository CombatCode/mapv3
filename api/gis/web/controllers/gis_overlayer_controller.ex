defmodule Gis.GisOverlayerController do
  use Gis.Web, :controller

  alias Gis.GisOverlayer

  def index(conn, _params) do
    gisoverlayer = Repo.all(GisOverlayer)
    render(conn, "index.html", gisoverlayers: gisoverlayer)
  end

  def new(conn, _params) do
    changeset = GisOverlayer.changeset(%GisOverlayer{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"gis_overlayers" => gis_overlayers_params}) do
    changeset = GisOverlayer.changeset(%GisOverlayer{}, gis_overlayers_params)

    case Repo.insert(changeset) do
      {:ok, _gis_overlayers} ->
        conn
        |> put_flash(:info, "Gis overlayers created successfully.")
        |> redirect(to: gis_overlayer_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    gis_overlayers = Repo.get!(GisOverlayer, id)
    render(conn, "show.html", gis_overlayers: gis_overlayers)
  end

  def edit(conn, %{"id" => id}) do
    gis_overlayers = Repo.get!(GisOverlayer, id)
    changeset = GisOverlayer.changeset(gis_overlayers)
    render(conn, "edit.html", gis_overlayer: gis_overlayers, changeset: changeset)
  end

  def update(conn, %{"id" => id, "gis_overlayers" => gis_overlayers_params}) do
    gis_overlayers = Repo.get!(GisOverlayer, id)
    changeset = GisOverlayer.changeset(gis_overlayers, gis_overlayers_params)

    case Repo.update(changeset) do
      {:ok, gis_overlayers} ->
        conn
        |> put_flash(:info, "Gis overlayers updated successfully.")
        |> redirect(to: gis_overlayer_path(conn, :show, gis_overlayers))
      {:error, changeset} ->
        render(conn, "edit.html", gis_overlayers: gis_overlayers, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    gis_overlayers = Repo.get!(GisOverlayer, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(gis_overlayers)

    conn
    |> put_flash(:info, "Gis overlayers deleted successfully.")
    |> redirect(to: gis_overlayer_path(conn, :index))
  end
end
