defmodule PlConnect.Cod.Resource.Bet.Changes.CheckWholeTeamPublic do
  @moduledoc """
  Check if the users has enough money inside their wallet
  """
  use Ash.Resource.Change

  alias Ash.Changeset
  alias PlConnect.Helpers
  alias PlConnect.Cod.Resource.Team.Changes.SavePrivateUsers

  require Ash.Query

  def check_whole_team_public do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn changeset, record ->
      users = evaluate_private_users(changeset)

      if Enum.empty?(users) do
        {:ok, record}
      else
        {:error, handle_error(changeset, users).errors}
      end
    end)
  end

  defp evaluate_private_users(changeset) do
    team_id = Changeset.get_argument(changeset, :team_id)
    team =
      PlConnect.Cod.Team
      |> Ash.Query.filter(id == ^team_id)
      |> Ash.Query.load([:owner, teammates: [:user]])
      |> PlConnect.Api.read_one!()

    Enum.filter(team.teammates, fn teammate ->
      data = %{
        psn_platform_username: teammate.user.psn_platform_username,
        xbl_platform_username: teammate.user.xbl_platform_username,
        battlenet_platform_username: teammate.user.battlenet_platform_username
      }
      gamertag = Helpers.get_username_platform(data)

      {_, is_visible?} = SavePrivateUsers.account_visible(gamertag, teammate.lobby_platform)
      !is_visible?
    end)
    |> Enum.map(fn teammate ->
      Helpers.get_username_platform(teammate.user)
    end)
  end

  defp handle_error(changeset, usernames) do
    Ash.Changeset.add_error(changeset,
      field: :users,
      message:
        "The #{Helpers.text_plural_singular(usernames, "players", "player")} #{
          Helpers.arr_to_string(usernames)
        } have a private profile. Please make it public before placing a bet"
    )
  end
end
