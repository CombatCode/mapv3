defmodule Gis.GisMapAssocController do
  use Gis.Web, :controller

  alias Gis.GisMapAssoc

  def index(conn, _params) do
    gismapassocs = Repo.all(GisMapAssoc)
    render(conn, "index.html", gismapassocs: gismapassocs)
  end

  def new(conn, _params) do
    changeset = GisMapAssoc.changeset(%GisMapAssoc{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"gis_map_assoc" => gis_map_assoc_params}) do
    changeset = GisMapAssoc.changeset(%GisMapAssoc{}, gis_map_assoc_params)

    case Repo.insert(changeset) do
      {:ok, _gis_map_assoc} ->
        conn
        |> put_flash(:info, "Gis map assoc created successfully.")
        |> redirect(to: gis_map_assoc_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    gis_map_assoc = Repo.get!(GisMapAssoc, id)
    render(conn, "show.html", gis_map_assoc: gis_map_assoc)
  end

  def edit(conn, %{"id" => id}) do
    gis_map_assoc = Repo.get!(GisMapAssoc, id)
    changeset = GisMapAssoc.changeset(gis_map_assoc)
    render(conn, "edit.html", gis_map_assoc: gis_map_assoc, changeset: changeset)
  end

  def update(conn, %{"id" => id, "gis_map_assoc" => gis_map_assoc_params}) do
    gis_map_assoc = Repo.get!(GisMapAssoc, id)
    changeset = GisMapAssoc.changeset(gis_map_assoc, gis_map_assoc_params)

    case Repo.update(changeset) do
      {:ok, gis_map_assoc} ->
        conn
        |> put_flash(:info, "Gis map assoc updated successfully.")
        |> redirect(to: gis_map_assoc_path(conn, :show, gis_map_assoc))
      {:error, changeset} ->
        render(conn, "edit.html", gis_map_assoc: gis_map_assoc, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    gis_map_assoc = Repo.get!(GisMapAssoc, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(gis_map_assoc)

    conn
    |> put_flash(:info, "Gis map assoc deleted successfully.")
    |> redirect(to: gis_map_assoc_path(conn, :index))
  end
end
