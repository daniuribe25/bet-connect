defmodule PlConnectWeb.UserChannelTest do
  use PlConnectWeb.ChannelCase

  alias PlConnect.Api
  alias PlConnect.Cod.User

  setup do
    params = params_for(:user)

    {:ok, %User{id: id}} =
      Api.create_user_platform_bypass(%{
        password: "password_example",
        password_confirmation: "password_example",
        email: params.email,
        psn_platform_username: params.psn_platform_username
      })

    {:ok, _, socket} =
      PlConnectWeb.UserSocket
      |> socket("user:#{id}", %{user_id: id})
      |> subscribe_and_join(PlConnectWeb.UserChannel, "user:#{id}")

    %{socket: socket}
  end

  test "invite event works properly", %{socket: socket} do
    ref = push(socket, "invite", %{"user_id" => UUID.uuid4(), "metadata" => %{"bar" => "foo"}})
    assert_reply ref, :ok, %{push_sended: true}
  end
end
