defmodule PlConnect.SummaryTest do
  use PlConnect.DataCase, async: false
  use Oban.Testing, repo: PlConnect.Repo
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  alias PlConnect.Cod.SummaryStats
  alias PlConnect.Workers.Summary
  alias PlConnect.Api

  require Ash.Query
  require Ash.Changeset

  setup do
    populate_bet_values()
  end

  test "should save amount of players on platform" do
    create_players(4)

    %{}
    |> Summary.new()
    |> Oban.insert()

    assert_enqueued(worker: Summary)
    assert %{success: 1, failure: 0} = Oban.drain_queue(queue: :summary, with_scheduled: true)
    assert [] = all_enqueued(worker: Summary)
    summary =
      SummaryStats
      |> Api.read_one!()

    assert summary.total_registered_players == 4
    assert summary.total_funds_in_player_accounts == 400.0
    assert summary.average_player_balance == 100.0
    assert summary.total_new_players == 4
  end

  test "should only get new players" do
    create_players(4)

    five_days_ago = Timex.now()
    |> Timex.shift(days: -5)

    with_mock DateTime, [utc_now: fn() -> five_days_ago end] do
      create_players(2) #Create Old Players
    end

    %{}
    |> Summary.new()
    |> Oban.insert()

    assert_enqueued(worker: Summary)
    assert %{success: 1, failure: 0} = Oban.drain_queue(queue: :summary, with_scheduled: true)
    assert [] = all_enqueued(worker: Summary)
    summary =
      SummaryStats
      |> Api.read_one!()

    assert summary.total_registered_players == 6
    assert summary.total_funds_in_player_accounts == 600.0
    assert summary.average_player_balance == 100.0
    assert summary.total_new_players == 4
  end

  test "should report how many new players have completed a game" do
    %{ players: players, bet: bet} = create_team_and_play() #one game with new players
    Enum.take(players, 2)
    |> insert_matches(bet)

    five_days_ago = Timex.now()
    |> Timex.shift(days: -5)

    with_mock DateTime, [:passthrough], [utc_now: fn() -> five_days_ago end] do
      %{players: players, bet: bet} = create_team_and_play(3) #one team with 3 players played before
      insert_matches(players, bet)
    end


    %{}
    |> Summary.new()
    |> Oban.insert()

    assert_enqueued(worker: Summary)
    assert %{success: 1, failure: 0} = Oban.drain_queue(queue: :summary, with_scheduled: true)
    assert [] = all_enqueued(worker: Summary)
    summary =
      SummaryStats
      |> Api.read_one!()

    assert summary.total_registered_players == 7
    assert summary.total_funds_in_player_accounts == 665.0
    assert summary.average_player_balance == 95.0
    assert summary.total_new_players == 4
    assert summary.total_new_players_completed_a_game == 2
    assert summary.total_matches_played == 5
    assert summary.total_matches_per_player == 0.7142857142857143
    assert summary.total_bets_placed == 21
    assert summary.total_entry_fees == 35.0
    assert summary.total_bets_placed_per_player == 3.0
    assert summary.total_house_money_won_to_players == 0.0
    assert summary.total_net_performance == 0.0
  end

  #todo: add a test with a resolved bet.

  defp create_team_and_play(count \\ 4) do
    players = create_players(count)
    team = create_team(players, :rookie)
    bet =
      create_bet(team)
      |> Api.set_user_bet_complete!()

    %{ players: players, bet: bet, team: team}
  end
end
