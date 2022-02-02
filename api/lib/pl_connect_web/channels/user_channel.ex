defmodule PlConnectWeb.UserChannel do
  use Phoenix.Channel

  alias PlConnect.Api
  alias PlConnect.InviteLobby

  @impl true
  def join("user:" <> id, _, %{assigns: %{user_id: user_id}} = socket) when id == user_id do
    lobby = InviteLobby.get_lobby(user_id) |> format()
    {:ok, %{lobby: lobby}, socket}
  end
  def join(_, _, _), do: {:error, %{reason: "unauthorized"}}

  @impl true
  def handle_in("invite", params, %{assigns: %{user_id: user_id}} = socket) do
    event = Map.get(params, "event")
    metadata = Map.get(params, "metadata", %{})
    param_user_id = Map.get(params, "user_id")

    result =
      case event do
        # leader context, user_id is the leader id
        "invite" ->
          invited_lobby = InviteLobby.get_lobby(param_user_id)

          if is_nil(invited_lobby) do
            lobby = get_or_create_lobby(user_id, metadata)

            users =
              invite_to_lobby(param_user_id)
              |> (&(lobby.users ++ [&1])).()

            {:ok, Api.update_users_lobby!(lobby, users)}
          else
            team = Api.read_active_team!(user_id)
            if length(team.teammates) > 1 do 
              status =
                Enum.find(invited_lobby.users, &(&1.user_id == param_user_id)) |> Map.get(:status)

              reject_status = if status == :joined, do: 2, else: 3
              {:error, %{reason: reject_status}}
            else
              Api.disband_team(team)
              lobby = get_or_create_lobby(user_id, metadata)

              users =
                invite_to_lobby(param_user_id)
                |> (&(lobby.users ++ [&1])).()

              {:ok, Api.update_users_lobby!(lobby, users)}
            end
          end

        "kick" ->
          lobby = get_or_create_lobby(user_id, metadata)
          users = Enum.filter(lobby.users, &(&1.user_id != param_user_id))

          if length(users) == 1 do
            {:ok, Api.destroy_lobby!(lobby)}
          else
            {:ok, Api.update_users_lobby!(lobby, users)}
          end

        # invited context, user_id is the invited user id
        "join" ->
          lobby = get_or_create_lobby(param_user_id, metadata)
          users = Enum.filter(lobby.users, &(&1.user_id != user_id))

          users =
            join_to_lobby(user_id)
            |> (&(users ++ [&1])).()

          {:ok, Api.update_users_lobby!(lobby, users)}

        "decline" ->
          lobby = get_or_create_lobby(param_user_id, metadata)
          users = Enum.filter(lobby.users, &(&1.user_id != user_id))
          {:ok, Api.update_users_lobby!(lobby, users)}

        "update" ->
          {:ok, get_or_create_lobby(user_id, metadata)}

        _ ->
          {:ok, nil}
      end

    data =
      case result do
        {:ok, _} ->
          PlConnectWeb.Endpoint.broadcast("user:#{param_user_id}", "invite", params)
          %{push_sended: true}

        {:error, info} ->
          %{push_sended: false, info: info}
      end

    {:reply, {:ok, data}, socket}
  end

  defp get_or_create_lobby(user_id, metadata) do
    lobby = InviteLobby.get_lobby(user_id)

    lobby =
      if is_nil(lobby) do
        Api.create_lobby!(%{
          leader_id: user_id,
          metadata: metadata,
          users: [join_to_lobby(user_id)]
        })
      else
        lobby
      end

    if metadata != %{}, do: Api.update_metadata_lobby!(lobby, metadata), else: lobby
  end

  defp join_to_lobby(user_id), do: %{user_id: user_id, status: :joined}
  defp invite_to_lobby(user_id), do: %{user_id: user_id, status: :pending}

  defp format(%PlConnect.InviteLobby{} = lobby) do
    Map.take(lobby, [:id, :leader_id, :metadata])
    |> Map.put(:users, Enum.map(lobby.users, &format(&1)))
  end

  defp format(%PlConnect.InviteLobby.User{} = user), do: Map.take(user, [:user_id, :status])
  defp format(nil), do: nil
end
