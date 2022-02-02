defmodule PlConnect.Workers.Summary do
  @moduledoc """
  Runs once per iteration cycle (week atm) to calculate stats.
  Reads all stats of casino, generates one summary


  """
  use Oban.Worker,
    queue: :summary,
    priority: 0

  import Ecto.Query
  alias PlConnect.Repo
  require Ash.Query

  @impl Oban.Worker
  def perform(_job) do
    # todo: allow a 'range' to select iteration, day, week, etc
    range = :day

    end_range = Timex.now()
    |> Timex.end_of_day()

    start_range =
      case range do
        :day ->
          end_range
          |> Timex.shift(days: -1)

          # :week ->
          #   end_range
          #   |> shift(weeks: -1)
      end

    %{
      total_registered_players: total_registered_players,
      total_funds_in_player_accounts: total_funds_in_player_accounts
    } = Repo.one(from u in "users", select: %{
      total_registered_players: fragment("count(*)"),
      total_funds_in_player_accounts: fragment("sum((wallet->>'funds')::float)")
    })
    average_player_balance = total_funds_in_player_accounts / total_registered_players

    # Summary Stats for Time Period
    %{ total_new_players: total_new_players } = Repo.one(from u in "users",
      select: %{
        total_new_players: fragment("coalesce(count(*), 0)")
      },
      where: u.inserted_at > ^start_range and u.inserted_at < ^end_range
    )

    %{
      total_new_players_completed_a_game: total_new_players_completed_a_game
    } = Repo.one(from m in "player_matches",
      join: u in "users", on: m.user_id == u.id,
      select: %{
        total_new_players_completed_a_game: fragment("count(distinct user_id)")
      },
      where: u.inserted_at > ^start_range and u.inserted_at < ^end_range
    )

    %{
      total_matches_played: total_matches_played
    } = Repo.one(from m in "player_matches",
      select: %{
        total_matches_played: fragment("coalesce(count(*), 0)")
    })

    total_matches_per_player = total_matches_played / total_registered_players

    %{
      total_bets_placed: total_bets_placed,
      total_entry_fees: total_entry_fees
    } =
      Repo.one(from w in "wallet_transactions",
      select: %{
        total_bets_placed: fragment("coalesce(count(*), 0)"),
        total_entry_fees: fragment("coalesce(sum(bet_total_amount), 0)")
      },
      where: w.status == "created"
    )

    total_bets_placed_per_player = total_bets_placed / total_registered_players

    %{
      total_house_money_won_to_players: total_house_money_won_to_players,
    } = Repo.one(from w in "wallet_transactions",
      select: %{
        total_house_money_won_to_players: fragment("coalesce(sum(won_reward), 0)")
      },
      where: w.status == "complete"
    )

    %{
      total_player_money_lost_to_house: total_player_money_lost_to_house
    } = Repo.one(from w in "wallet_transactions",
      select: %{
        total_player_money_lost_to_house: fragment("coalesce(sum(bet_total_amount), 0)")
      },
      where: w.status == "complete" and w.won == false
    )

    total_net_performance = if total_house_money_won_to_players == 0.0, do: 0.0, else: total_player_money_lost_to_house - total_house_money_won_to_players
    total_percent_house_handle = if total_entry_fees == 0.0, do: 0.0, else: (total_entry_fees - total_house_money_won_to_players) / total_entry_fees
    entry_fees_per_player = total_entry_fees / total_registered_players
    total_house_money_won_per_player = total_house_money_won_to_players / total_registered_players
    total_house_money_lost_per_player = if total_player_money_lost_to_house == 0.0, do: 0.0, else: total_player_money_lost_to_house / total_player_money_lost_to_house
    total_net_performance_per_player = total_net_performance / total_registered_players

    # Save Totals
    Ash.Changeset.new(PlConnect.Cod.SummaryStats, %{
      start_range: start_range,
      end_range: end_range,

      total_registered_players: total_registered_players,
      total_funds_in_player_accounts: total_funds_in_player_accounts,
      average_player_balance: average_player_balance,
      total_new_players: total_new_players,
      total_new_players_completed_a_game: total_new_players_completed_a_game,
      total_matches_played: total_matches_played,
      total_matches_per_player: total_matches_per_player,
      total_bets_placed: total_bets_placed,
      total_entry_fees: total_entry_fees,
      total_bets_placed_per_player: total_bets_placed_per_player,
      total_house_money_won_to_players: total_house_money_won_to_players,
      total_player_money_lost_to_house: total_player_money_lost_to_house,
      total_net_performance: total_net_performance,
      total_percent_house_handle: total_percent_house_handle,
      entry_fees_per_player: entry_fees_per_player,
      total_house_money_won_per_player: total_house_money_won_per_player,
      total_house_money_lost_per_player: total_house_money_lost_per_player,
      total_net_performance_per_player: total_net_performance_per_player
    })
    |> PlConnect.Api.create()

    :ok
  end
end
