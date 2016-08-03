defmodule Gis.GisMapSetController do
  use Gis.Web, :controller

  alias Gis.GisMapSet

  def index(conn, _params) do
    gismapsets = Repo.all(GisMapSet)
    render(conn, "index.html", gismapsets: gismapsets)
  end

  def new(conn, _params) do
    changeset = GisMapSet.changeset(%GisMapSet{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"gis_map_set" => gis_map_set_params}) do
    changeset = GisMapSet.changeset(%GisMapSet{}, gis_map_set_params)

    case Repo.insert(changeset) do
      {:ok, _gis_map_set} ->
        conn
        |> put_flash(:info, "Gis map set created successfully.")
        |> redirect(to: gis_map_set_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    gis_map_set = Repo.get!(GisMapSet, id)
    render(conn, "show.html", gis_map_set: gis_map_set)
  end

  def edit(conn, %{"id" => id}) do
    gis_map_set = Repo.get!(GisMapSet, id)
    changeset = GisMapSet.changeset(gis_map_set)
    render(conn, "edit.html", gis_map_set: gis_map_set, changeset: changeset)
  end

  def update(conn, %{"id" => id, "gis_map_set" => gis_map_set_params}) do
    gis_map_set = Repo.get!(GisMapSet, id)
    changeset = GisMapSet.changeset(gis_map_set, gis_map_set_params)

    case Repo.update(changeset) do
      {:ok, gis_map_set} ->
        conn
        |> put_flash(:info, "Gis map set updated successfully.")
        |> redirect(to: gis_map_set_path(conn, :show, gis_map_set))
      {:error, changeset} ->
        render(conn, "edit.html", gis_map_set: gis_map_set, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    gis_map_set = Repo.get!(GisMapSet, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(gis_map_set)

    conn
    |> put_flash(:info, "Gis map set deleted successfully.")
    |> redirect(to: gis_map_set_path(conn, :index))
  end
end
