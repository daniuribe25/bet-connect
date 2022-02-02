defmodule PlConnectWeb.SessionSyncController do
  @moduledoc """
    Manages the views for admin login
  """
  use PlConnectWeb, :controller

  def index(conn, %{"token" => token}) do
    conn
    |> put_resp_cookie("auth_token", token)
    |> html("<script>close();</script>")
  end
end
