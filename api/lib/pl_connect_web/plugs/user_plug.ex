defmodule PlConnect.Plugs.UserPlug do
  @moduledoc """
  Plug for absinther authentication and ash permisions
  """
  @behaviour Plug

  @retool_token Application.get_env(:pl_connect, :retool_token)

  import Plug.Conn

  alias PlConnect.Cod.Sessions
  alias PlConnect.Cod.User
  alias PlConnect.Api

  def init(opts), do: opts

  def call(conn, _) do
    header = get_req_header(conn, "authorization") |> Enum.at(0)

    if header == @retool_token do
      conn
    else
      case build_context(conn) do
        {:ok, context} ->
          put_private(conn, :absinthe, %{context: context})

        _ ->
          conn
      end
    end
  end

  defp build_context(conn) do
    with ["" <> token] <- get_req_header(conn, "authorization"),
         {:ok, user_id} <- Sessions.retrive_token_data(token),
         {:ok, user} <- Api.get(User, id: user_id) do
      {:ok, %{actor: user, ash_context: %{some: :data}}}
    end
  end
end
