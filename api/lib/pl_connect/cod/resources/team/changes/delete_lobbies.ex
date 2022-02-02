defmodule PlConnect.Cod.Resource.Team.Changes.DeleteLobbies do
  @moduledoc """
  Ash change, delete the lobbies where the teammates are in
  """

  use Ash.Resource.Change

  alias PlConnect.Api
  alias PlConnect.InviteLobby

  def delete_lobbies do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn _, record ->
      Enum.each(record.teammates, fn mate ->
        InviteLobby.get_lobby(mate.user_id)
        |> (&(if !is_nil(&1), do: Api.destroy_lobby(&1))).()
      end)

      {:ok, record}
    end)
  end
end
