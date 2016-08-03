defmodule Gis.GisMapController do
  use Gis.Web, :controller

  alias Gis.GisMap

  def index(conn, _params) do
    gismaps = Repo.all(GisMap)
    render(conn, "index.html", gismaps: gismaps)
  end

  def new(conn, _params) do
    changeset = GisMap.changeset(%GisMap{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"gis_map" => gis_map_params}) do
    changeset = GisMap.changeset(%GisMap{}, gis_map_params)

    case Repo.insert(changeset) do
      {:ok, _gis_map} ->
        conn
        |> put_flash(:info, "Gis map created successfully.")
        |> redirect(to: gis_map_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    gis_map = Repo.get!(GisMap, id)
    render(conn, "show.html", gis_map: gis_map)
  end

  def edit(conn, %{"id" => id}) do
    gis_map = Repo.get!(GisMap, id)
    changeset = GisMap.changeset(gis_map)
    render(conn, "edit.html", gis_map: gis_map, changeset: changeset)
  end

  def update(conn, %{"id" => id, "gis_map" => gis_map_params}) do
    gis_map = Repo.get!(GisMap, id)
    changeset = GisMap.changeset(gis_map, gis_map_params)

    case Repo.update(changeset) do
      {:ok, gis_map} ->
        conn
        |> put_flash(:info, "Gis map updated successfully.")
        |> redirect(to: gis_map_path(conn, :show, gis_map))
      {:error, changeset} ->
        render(conn, "edit.html", gis_map: gis_map, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    gis_map = Repo.get!(GisMap, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(gis_map)

    conn
    |> put_flash(:info, "Gis map deleted successfully.")
    |> redirect(to: gis_map_path(conn, :index))
  end
end
