defmodule PlConnect.Cod.Resource.Team.Changes.ValidateIsActive do
  @moduledoc """
  Ash change, validate if the team is active
  """
  use Ash.Resource.Change
  require Ash.Query
  alias PlConnect.Api
  alias PlConnect.Helpers

  def validate_is_active do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn _, record ->
      users = evaluate_teams_active(record.teammates, record.id)

      if Enum.empty?(users) do
        {:ok, record}
      else
        {:error, incorrect_error(changeset, users).errors}
      end
    end)
  end

  defp evaluate_teams_active(teammates, team_id) do
    Enum.flat_map(teammates, fn record ->
      user = record.user |> Api.load!(teams: [team: [:teammates]])

      user.teams
      |> Enum.filter(fn team -> team.team.is_active and team.team.id != team_id and length(team.team.teammates) > 1 end)
      |> Enum.empty?()
      |> (&if(&1, do: [], else: [get_player_platform_username(record)])).()
    end)
  end

  defp incorrect_error(changeset, usernames) do
    Ash.Changeset.add_error(changeset,
      field: :users,
      message:
        "The #{Helpers.text_plural_singular(usernames, "players", "player")} #{
          format_users_no_matches(usernames)
        } have teams actives"
    )
  end

  defp format_users_no_matches([]), do: ""

  defp format_users_no_matches(usernames) do
    "#{Helpers.arr_to_string(usernames)}"
  end

  defp get_player_platform_username(%{lobby_platform: lobby_platform} = player)
       when lobby_platform in ["psn", :psn] do
    player.user.psn_platform_username
  end

  defp get_player_platform_username(%{lobby_platform: lobby_platform} = player)
       when lobby_platform in ["xbl", :xbl] do
    player.user.xbl_platform_username
  end

  defp get_player_platform_username(%{lobby_platform: lobby_platform} = player)
       when lobby_platform in ["battlenet", :battlenet] do
    player.user.battlenet_platform_username
  end
end
