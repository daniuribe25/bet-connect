defmodule PlConnect.Plugs.RestAuth do
  @moduledoc """
  Plug for absinther authentication and ash permisions
  """
  @behaviour Plug

  import Plug.Conn

  alias PlConnect.Api
  alias PlConnect.Cod.Sessions

  def init(opts), do: opts

  def call(conn, _) do
    case get_user(conn) do
      {:ok, user} -> assign(conn, :actor, user)
      _ ->
        resp(conn, 403, "not allowed")
        |> send_resp()
        |> halt()
    end
  end

  defp get_user(conn) do
    with [auth_token] <- get_req_header(conn, "authorization"),
         ["bearer", token] <- String.split(auth_token, " "),
         {:ok, user_id} <- Sessions.retrive_token_data(token),
         {:ok, user} <- Api.get_user(user_id) do
      {:ok, user}
    else
      _ -> {:error, nil}
    end
  end
end
