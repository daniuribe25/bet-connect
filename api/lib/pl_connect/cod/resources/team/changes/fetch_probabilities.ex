defmodule PlConnect.Cod.Resource.Team.Changes.FetchProbabilities do
  @moduledoc """
  Ash change, bet probabilities for the game modes Verdansk/Caldera and Rebirth
  """
  use Ash.Resource.Change

  require Ash.Query

  alias PlConnect.Api
  alias PlConnect.Helpers
  alias PlConnect.Cod.Feature
  alias PlConnect.Cod.BetLines
  alias PlConnect.Cod.PlayerMatch
  alias PlConnect.Cod.ProbabilitiesCalculator

  def fetch_probabilities do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn changeset, record ->
      players = record.teammates
      match_map = Ash.Changeset.get_attribute(changeset, :match_map)
      squad_size = Ash.Changeset.get_attribute(changeset, :squad_size)
      {:ok, bet_category} = Ash.Changeset.fetch_argument(changeset, :bet_category)

      probabilities = ProbabilitiesCalculator.calculate_probabilities(players, match_map, bet_category, squad_size)

      case probabilities do
        {:ok, {:error, :max_kda}} ->
          changeset = Ash.Changeset.add_error(
                changeset,
                field: :team,
                message: "Sorry, This game mode is not available for this team"
              )
              {:error, changeset.errors}
        {:ok, probabilities} ->
          generated = case match_map do
            :rebirth_island -> format_rebirth_bet_lines(players, bet_category)
            _ -> BetLines.get_team_bet_lines(players, match_map, bet_category, squad_size)
          end
          data = %{
            probabilities: probabilities,
            probabilities_generated: generated
          }

          record = Api.set_team_probabilities!(record, data)
          Enum.each(
            players,
            &PlConnectWeb.Endpoint.broadcast("user:#{&1.user_id}", "new_team", %{
              team_id: record.id
            })
          )
          {:ok, record}
        {:error, {:cannot_generate_kda, username}} ->
          changeset =
            Ash.Changeset.add_error(changeset,
              field: :users,
              message:
                "Can't retrieve the KDA for the given user #{username}. Make sure has played some matches, if this continue is due to an error to CoD Api so try later please."
            )

          {:error, changeset.errors}

        {:matches_error, matches, missing_usernames} ->
          formated_matches = format_matches(matches)

          changeset =
            Ash.Changeset.add_error(changeset,
              field: :users,
              message:
                "The given users: #{formated_matches} does not have enough matches for the given gamemode - #{
                  format_users_no_matches(missing_usernames)
                }, if you've data please wait a couple minutes while we retrive it"
            )

          {:error, changeset.errors}

        :no_matches_error ->
          changeset =
            Ash.Changeset.add_error(changeset,
              field: :users,
              message:
                "None of the given users have enough matches valid for the platform, please play more games. (If the players have matches there's an issue with the CoD api! Please try again later)"
            )

          {:error, changeset.errors}

        {:partial_matches_error, matches, missing_usernames} ->
          changeset =
            Ash.Changeset.add_error(changeset,
              field: :users,
              message:
                "Some of the given users do not have enough matches valid for the platform, please play more games #{
                  format_users_no_matches(missing_usernames)
                } #{fotmat_incorrect_matches_amount(matches)} (If the players have matches there's an issue with the CoD api! Please try again later)"
            )

          {:error, changeset.errors}

        {:error, :min_num_players, min_num} ->
          changeset =
            Ash.Changeset.add_error(changeset,
              field: :teammates,
              message: "This mode requires at least #{min_num} players."
            )

          {:error, changeset.errors}

        {:error, :invalid_data} ->
          changeset =
            Ash.Changeset.add_error(changeset,
              field: :teammates,
              message: "The team should have 3 or 4 players!"
            )

          {:error, changeset.errors}
      end
    end)
  end

  defp fotmat_incorrect_matches_amount([]), do: ""

  defp fotmat_incorrect_matches_amount(matches) do
    formated_matches = format_matches(matches)

    "- The given users: #{formated_matches}"
  end

  defp format_users_no_matches([]), do: ""

  defp format_users_no_matches(missing_usernames) do
    "- Usernames with no matches found for the category: #{
      Helpers.arr_to_string(missing_usernames)
    }"
  end

  defp format_matches(matches) do
    matches
    |> Enum.map(fn {username, matches_length} ->
      "(Username: #{username} - Valid Matches: #{matches_length})"
    end)
    |> Enum.join(" - ")
  end

  defp format_rebirth_bet_lines(players, bet_category) do
    default_version = Feature.get_feature_flag(:rebirth_lines_version) |> Map.get(:value)
    default_value = Feature.get_feature_flag(:rebirth_lines_default_value) |> Map.get(:value)
    team_size = case length(players) do
      4 -> :quads
      3 -> :trios
      _ -> :duos
    end
    user_ids = Enum.map(players, &(&1.id))

    values = PlayerMatch
      |> Ash.Query.filter(user_id in ^user_ids)
      |> Ash.Query.sort(match_date: :asc)
      |> Ash.Query.select([:id, :kills])
      |> Api.read!()
      |> Enum.group_by(&(&1.user_id))
    lines = Enum.map(players, fn player ->
        values = Map.get(values, player.id, [])
        case values do
          [] -> default_value
          values -> values |> Enum.map(&(&1.kills)) |> Enum.sum() |> Kernel./(length(values))
        end
      end)
      |> Enum.sum()
      |> Api.get_rebirth_line(team_size, default_version)
      |> case  do
           {:ok, line} -> line
           _ -> nil
         end


    bet_lines = %PlConnect.Cod.Team.Embedded.BetLine{
      main: [
        %{
          level: 1,
          goal: lines.kills_bet_1,
          payout: lines.payout_bet_1
        },
        %{
          level: 2,
          goal: lines.kills_bet_2,
          payout: lines.payout_bet_2
        },
        %{
          level: 3,
          goal: lines.kills_bet_3,
          payout: lines.payout_bet_3
        }
      ],
      kills: [],
      placement: [],
      damage: [],
      match: []
    }
    %PlConnect.Cod.Team.Embedded.Probabilities{
      game_mode: :rebirth_island,
      bet_category: bet_category,
      bet_lines: bet_lines
    }
  end
end
