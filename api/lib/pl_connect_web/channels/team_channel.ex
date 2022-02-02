defmodule PlConnectWeb.TeamChannel do
  use Phoenix.Channel

  alias PlConnect.Api
  alias PlConnect.Cod.Team

  @impl true
  def join("team:" <> id, _params, socket) do
    case Api.get(Team, id: id) do
      #      TODO: add security, verify if the user is related with the team
      {:ok, _} -> {:ok, socket}
      _ -> {:error, %{reason: "unauthorized"}}
    end

    {:ok, socket}
  end

  @impl true
  def handle_in("update", params, socket) do
    broadcast!(socket, "update", params)
    {:noreply, socket}
  end
end
