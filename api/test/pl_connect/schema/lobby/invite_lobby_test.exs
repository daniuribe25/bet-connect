defmodule PlConnect.InviteLobbyTest do
  use PlConnect.DataCase

  import PlConnect.TestHelpers

  alias PlConnect.Api
  alias PlConnect.InviteLobby

  @fields [:id, :leader_id, :metadata, :users]

  setup do
    {:ok, lobbies} = Api.get_lobbies()
    Enum.each(lobbies, &Api.destroy_lobby/1)
  end

  test "get_lobbies/0 returns all lobbies from all users" do
    params = params_for(:invite_lobby)
    assert {:ok, %InviteLobby{} = created_lobby} = Api.create_lobby(params)
    assert {:ok, [lobby]} = Api.get_lobbies()
    assert_fields(lobby, created_lobby, @fields)
    assert :ok = Api.destroy_lobby(lobby)
  end

  test "update_users_lobby/2 updates the users on lobby" do
    params = params_for(:invite_lobby)
    {:ok, %InviteLobby{users: users} = created_lobby} = Api.create_lobby(params)

    assert length(users) == 2

    assert {:ok, %InviteLobby{users: users} = updated_lobby} =
             Api.update_users_lobby(
               created_lobby,
               users ++ [%{user_id: UUID.uuid4(), status: :pending}]
             )

    assert {:ok, [lobby]} = Api.get_lobbies()

    assert length(users) == 3
    assert_fields(lobby, updated_lobby, @fields)
    assert :ok = Api.destroy_lobby(lobby)
  end

  test "update_metadata_lobby/2 updates the users on lobby" do
    params = params_for(:invite_lobby)
    {:ok, %InviteLobby{metadata: metadata} = created_lobby} = Api.create_lobby(params)

    assert metadata == %{foo: "bar"}

    assert {:ok, %InviteLobby{metadata: metadata} = updated_lobby} =
             Api.update_metadata_lobby(created_lobby, %{bar: "foo"})

    assert {:ok, [lobby]} = Api.get_lobbies()

    assert metadata == %{bar: "foo"}
    assert_fields(lobby, updated_lobby, @fields)
    assert :ok = Api.destroy_lobby(lobby)
  end

  test "destroy_lobby/1 deletes the lobby" do
    params = params_for(:invite_lobby)
    {:ok, %InviteLobby{} = created_lobby} = Api.create_lobby(params)

    assert :ok = Api.destroy_lobby(created_lobby)
    assert {:ok, []} = Api.get_lobbies()
  end
end
