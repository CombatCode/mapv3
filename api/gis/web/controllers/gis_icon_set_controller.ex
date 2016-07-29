defmodule Gis.GisIconSetController do
  use Gis.Web, :controller

  alias Gis.GisIconSet

  def index(conn, _params) do
    gisiconsets = Repo.all(GisIconSet)
    render(conn, "index.html", gisiconsets: gisiconsets)
  end

  def new(conn, _params) do
    changeset = GisIconSet.changeset(%GisIconSet{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"gis_icon_set" => gis_icon_set_params}) do
    changeset = GisIconSet.changeset(%GisIconSet{}, gis_icon_set_params)

    case Repo.insert(changeset) do
      {:ok, _gis_icon_set} ->
        conn
        |> put_flash(:info, "Gis icon set created successfully.")
        |> redirect(to: gis_icon_set_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    gis_icon_set = Repo.get!(GisIconSet, id)
    render(conn, "show.html", gis_icon_set: gis_icon_set)
  end

  def edit(conn, %{"id" => id}) do
    gis_icon_set = Repo.get!(GisIconSet, id)
    changeset = GisIconSet.changeset(gis_icon_set)
    render(conn, "edit.html", gis_icon_set: gis_icon_set, changeset: changeset)
  end

  def update(conn, %{"id" => id, "gis_icon_set" => gis_icon_set_params}) do
    gis_icon_set = Repo.get!(GisIconSet, id)
    changeset = GisIconSet.changeset(gis_icon_set, gis_icon_set_params)

    case Repo.update(changeset) do
      {:ok, gis_icon_set} ->
        conn
        |> put_flash(:info, "Gis icon set updated successfully.")
        |> redirect(to: gis_icon_set_path(conn, :show, gis_icon_set))
      {:error, changeset} ->
        render(conn, "edit.html", gis_icon_set: gis_icon_set, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    gis_icon_set = Repo.get!(GisIconSet, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(gis_icon_set)

    conn
    |> put_flash(:info, "Gis icon set deleted successfully.")
    |> redirect(to: gis_icon_set_path(conn, :index))
  end
end
