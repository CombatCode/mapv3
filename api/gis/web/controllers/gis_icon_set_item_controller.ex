defmodule Gis.GisIconSetItemController do
  use Gis.Web, :controller

  alias Gis.GisIconSetItem

  def index(conn, _params) do
    gisiconsetitems = Repo.all(GisIconSetItem)
    render(conn, "index.html", gisiconsetitems: gisiconsetitems)
  end

  def new(conn, _params) do
    changeset = GisIconSetItem.changeset(%GisIconSetItem{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"gis_icon_set_item" => gis_icon_set_item_params}) do
    changeset = GisIconSetItem.changeset(%GisIconSetItem{}, gis_icon_set_item_params)

    case Repo.insert(changeset) do
      {:ok, _gis_icon_set_item} ->
        conn
        |> put_flash(:info, "Gis icon set item created successfully.")
        |> redirect(to: gis_icon_set_item_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    gis_icon_set_item = Repo.get!(GisIconSetItem, id)
    render(conn, "show.html", gis_icon_set_item: gis_icon_set_item)
  end

  def edit(conn, %{"id" => id}) do
    gis_icon_set_item = Repo.get!(GisIconSetItem, id)
    changeset = GisIconSetItem.changeset(gis_icon_set_item)
    render(conn, "edit.html", gis_icon_set_item: gis_icon_set_item, changeset: changeset)
  end

  def update(conn, %{"id" => id, "gis_icon_set_item" => gis_icon_set_item_params}) do
    gis_icon_set_item = Repo.get!(GisIconSetItem, id)
    changeset = GisIconSetItem.changeset(gis_icon_set_item, gis_icon_set_item_params)

    case Repo.update(changeset) do
      {:ok, gis_icon_set_item} ->
        conn
        |> put_flash(:info, "Gis icon set item updated successfully.")
        |> redirect(to: gis_icon_set_item_path(conn, :show, gis_icon_set_item))
      {:error, changeset} ->
        render(conn, "edit.html", gis_icon_set_item: gis_icon_set_item, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    gis_icon_set_item = Repo.get!(GisIconSetItem, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(gis_icon_set_item)

    conn
    |> put_flash(:info, "Gis icon set item deleted successfully.")
    |> redirect(to: gis_icon_set_item_path(conn, :index))
  end
end
