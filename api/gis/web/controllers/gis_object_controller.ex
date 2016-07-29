defmodule Gis.GisObjectController do
  use Gis.Web, :controller
  import Geo.PostGIS
  alias Gis.GisObject

  def index(conn, _params) do
    gisobjects = Repo.all(GisObject)
    render(conn, "index.html", gisobjects: gisobjects)
  end

  def new(conn, _params) do
    changeset = GisObject.changeset(%GisObject{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"gis_object" => gis_object_params}) do
    changeset = GisObject.changeset(%GisObject{}, gis_object_params)

    case Repo.insert(changeset) do
      {:ok, _gis_object} ->
        conn
        |> put_flash(:info, "Gis object created successfully.")
        |> redirect(to: gis_object_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    gis_object = Repo.get!(GisObject, id)
    render(conn, "show.html", gis_object: gis_object)
  end

  def edit(conn, %{"id" => id}) do
    gis_object = Repo.get!(GisObject, id)
    changeset = GisObject.changeset(gis_object)
    render(conn, "edit.html", gis_object: gis_object, changeset: changeset)
  end

  def update(conn, %{"id" => id, "gis_object" => gis_object_params}) do
    gis_object = Repo.get!(GisObject, id)
    changeset = GisObject.changeset(gis_object, gis_object_params)

    case Repo.update(changeset) do
      {:ok, gis_object} ->
        conn
        |> put_flash(:info, "Gis object updated successfully.")
        |> redirect(to: gis_object_path(conn, :show, gis_object))
      {:error, changeset} ->
        render(conn, "edit.html", gis_object: gis_object, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    gis_object = Repo.get!(GisObject, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(gis_object)

    conn
    |> put_flash(:info, "Gis object deleted successfully.")
    |> redirect(to: gis_object_path(conn, :index))
  end
end
