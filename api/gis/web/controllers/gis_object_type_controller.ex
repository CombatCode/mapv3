defmodule Gis.GisObjectTypeController do
  use Gis.Web, :controller

  alias Gis.GisObjectType

  def index(conn, _params) do
    gisobjecttypes = Repo.all(GisObjectType)
    render(conn, "index.html", gisobjecttypes: gisobjecttypes)
  end

  def new(conn, _params) do
    changeset = GisObjectType.changeset(%GisObjectType{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"gis_object_type" => gis_object_type_params}) do
    changeset = GisObjectType.changeset(%GisObjectType{}, gis_object_type_params)

    case Repo.insert(changeset) do
      {:ok, _gis_object_type} ->
        conn
        |> put_flash(:info, "Gis object type created successfully.")
        |> redirect(to: gis_object_type_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    gis_object_type = Repo.get!(GisObjectType, id)
    render(conn, "show.html", gis_object_type: gis_object_type)
  end

  def edit(conn, %{"id" => id}) do
    gis_object_type = Repo.get!(GisObjectType, id)
    changeset = GisObjectType.changeset(gis_object_type)
    render(conn, "edit.html", gis_object_type: gis_object_type, changeset: changeset)
  end

  def update(conn, %{"id" => id, "gis_object_type" => gis_object_type_params}) do
    gis_object_type = Repo.get!(GisObjectType, id)
    changeset = GisObjectType.changeset(gis_object_type, gis_object_type_params)

    case Repo.update(changeset) do
      {:ok, gis_object_type} ->
        conn
        |> put_flash(:info, "Gis object type updated successfully.")
        |> redirect(to: gis_object_type_path(conn, :show, gis_object_type))
      {:error, changeset} ->
        render(conn, "edit.html", gis_object_type: gis_object_type, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    gis_object_type = Repo.get!(GisObjectType, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(gis_object_type)

    conn
    |> put_flash(:info, "Gis object type deleted successfully.")
    |> redirect(to: gis_object_type_path(conn, :index))
  end
end
