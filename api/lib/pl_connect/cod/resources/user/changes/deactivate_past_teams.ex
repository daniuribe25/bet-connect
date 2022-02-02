defmodule PlConnect.Cod.Resource.Changes.User.DeactivatePastTeams do
  @moduledoc """
  Ash change, checks user exist
  """
  use Ash.Resource.Change

  require Ash.Query

  alias PlConnect.Api
  #  alias PlConnect.Cod.User
  alias PlConnect.Cod.Team.TeamUsers

  def deactivate_past_teams do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    user_id = Ash.Changeset.get_attribute(changeset, :id)

    Ash.Query.filter(TeamUsers, user_id == ^user_id)
    |> Ash.Query.load([:team])
    |> Ash.Query.limit(40)
    |> Ash.Query.sort(inserted_at: :desc)
    |> PlConnect.Api.read!()
    |> Enum.flat_map(&if &1.team.is_active, do: [&1.team], else: [])
    |> Enum.map(&Api.disband_team(&1))

    changeset
  end
end
