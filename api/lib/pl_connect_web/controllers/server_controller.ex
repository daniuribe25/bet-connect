defmodule PlConnectWeb.ServerController do
  @moduledoc false
  use PlConnectWeb, :controller

  def index(conn, _) do
    conn
    |> put_status(200)
    |> html("")
  end
end
