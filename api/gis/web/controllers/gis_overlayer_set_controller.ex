defmodule Gis.GisOverlayerSetController do
  use Gis.Web, :controller

  alias Gis.GisOverlayerSet

  def index(conn, _params) do
    gisoverlayersets = Repo.all(GisOverlayerSet)
    render(conn, "index.html", gisoverlayersets: gisoverlayersets)
  end

  def new(conn, _params) do
    changeset = GisOverlayerSet.changeset(%GisOverlayerSet{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"gis_overlayer_set" => gis_overlayer_set_params}) do
    changeset = GisOverlayerSet.changeset(%GisOverlayerSet{}, gis_overlayer_set_params)

    case Repo.insert(changeset) do
      {:ok, _gis_overlayer_set} ->
        conn
        |> put_flash(:info, "Gis overlayer set created successfully.")
        |> redirect(to: gis_overlayer_set_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    gis_overlayer_set = Repo.get!(GisOverlayerSet, id)
    render(conn, "show.html", gis_overlayer_set: gis_overlayer_set)
  end

  def edit(conn, %{"id" => id}) do
    gis_overlayer_set = Repo.get!(GisOverlayerSet, id)
    changeset = GisOverlayerSet.changeset(gis_overlayer_set)
    render(conn, "edit.html", gis_overlayer_set: gis_overlayer_set, changeset: changeset)
  end

  def update(conn, %{"id" => id, "gis_overlayer_set" => gis_overlayer_set_params}) do
    gis_overlayer_set = Repo.get!(GisOverlayerSet, id)
    changeset = GisOverlayerSet.changeset(gis_overlayer_set, gis_overlayer_set_params)

    case Repo.update(changeset) do
      {:ok, gis_overlayer_set} ->
        conn
        |> put_flash(:info, "Gis overlayer set updated successfully.")
        |> redirect(to: gis_overlayer_set_path(conn, :show, gis_overlayer_set))
      {:error, changeset} ->
        render(conn, "edit.html", gis_overlayer_set: gis_overlayer_set, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    gis_overlayer_set = Repo.get!(GisOverlayerSet, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(gis_overlayer_set)

    conn
    |> put_flash(:info, "Gis overlayer set deleted successfully.")
    |> redirect(to: gis_overlayer_set_path(conn, :index))
  end
end
