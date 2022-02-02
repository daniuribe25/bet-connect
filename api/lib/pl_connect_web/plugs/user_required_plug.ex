defmodule PlConnect.Plugs.UserRequiredPlug do
  @moduledoc """
  Plug for admin panel authentication
  """
  @behaviour Plug

  import Plug.Conn

  alias PlConnect.Cod.Sessions
  alias PlConnect.Cod.User
  alias PlConnect.Api

  @admins Application.compile_env!(:pl_connect, :admins)

  def init(opts), do: opts

  def call(conn, _) do
    case build_context(conn) do
      {:ok, context} ->
        put_private(conn, :absinthe, %{context: context})

      _ ->
        send_resp(conn, 404, "Not found")
    end
  end

  defp build_context(conn) do
    with conn <- fetch_cookies(conn),
         %{"auth_token" => token} <- conn.req_cookies,
         {:ok, user_id} <- Sessions.retrive_token_data(token),
         {:ok, user} <- Api.get(User, id: user_id),
         true <- user.email in @admins do
      {:ok, %{actor: user, ash_context: %{some: :data}}}
    end
  end
end
