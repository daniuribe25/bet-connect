defmodule PlConnect.Cod.Resource.Team.Invitation.Changes.AddTeammate do
  @moduledoc """
  Ash change, password hashing
  """
  use Ash.Resource.Change

  alias PlConnect.Api

  def add_teammate do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn _, record ->
      {:ok, _} = Api.add_team_teammate(record.team, %{user_id: record.user_id})

      {:ok, record}
    end)
  end
end
