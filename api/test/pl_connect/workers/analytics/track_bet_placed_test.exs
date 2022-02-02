defmodule PlConnect.TrackBetPlacedTest do
  use PlConnect.DataCase, async: false
  use Oban.Testing, repo: PlConnect.Repo
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  alias PlConnect.Api
  alias PlConnect.Workers.Bet
  alias PlConnect.Workers.Analytics.TrackRefund
  alias PlConnect.Workers.Analytics.TrackBetPlaced
  alias PlConnect.Workers.Analytics.TrackBetResolved

  setup do
    populate_bet_values()

    Tesla.Mock.mock_global(fn
      %{method: :post, url: "https://api.segment.io/v1/track"} -> %Tesla.Env{status: 200, body: %{}}
      %{method: :post, url: "https://api.segment.io/v1/identify"} -> %Tesla.Env{status: 200, body: %{}}
    end)
  end

  test "should track a segment event when placing a bet" do
    users = create_players(2)
    team = create_team(users)
    team_bet = create_bet(team)

    Enum.reduce(users, 0, fn current_value, acc ->
      report = insert_user_event_info(%{
        user_id: current_value.id,
        event_name: "bet_placed",
        value: "20",
        additional_info: %{
          bets_count: 2,
          bets_count_lost: 2,
          bets_count_won: 2,
          bets_amount_total: 2,
          bets_amount_won: 2,
          bets_amount_lost: 2,
          bets_total: 2,
        }
      })
      acc + 1
    end)

    {:ok, num_reports} = Api.get_all_reports()
    assert 2 = length(num_reports)

    TrackBetPlaced.new(%{bet_id: team_bet.id}, schedule_in: 5)
    |> Oban.insert()

    assert :ok = perform_job(TrackBetPlaced, %{bet_id: team_bet.id})
  end

  test "should track a segment event when resolving a bet automatically" do
    [leader | _] = users = create_players(3)
    team = create_team(users)
    team_bet = create_bet(team)

    TrackBetPlaced.new(%{bet_id: team_bet.id})
    |> Oban.insert()

    assert :ok = perform_job(TrackBetPlaced, %{bet_id: team_bet.id})

    insert_matches(users, team_bet)

    %{bet_id: team_bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    perform_job(Bet.Process, %{bet_id: team_bet.id, retry_count: 0})

    TrackBetResolved.new(%{bet_id: team_bet.id, resolution_method: "auto"})
    |> Oban.insert()

    assert {:ok, report} = Api.get_report_event(leader.id, "bet_placed")
    assert report.user_id == leader.id
    assert report.event_name == "bet_placed"
    assert report.additional_info["bets_amount_total"] == 11.0

    assert :ok = perform_job(TrackBetResolved, %{bet_id: team_bet.id, resolution_method: "auto"})

    assert {:ok, report} = Api.get_report_event(leader.id, "bet_placed")
    assert report.user_id == leader.id
    assert report.event_name == "bet_placed"
    assert report.additional_info["bets_amount_total"] == 11.0
    assert report.additional_info["bets_amount_won"] == 24.0
  end

  test "should track a segment event when refunding a team bet" do
    users = create_players(2)
    team = create_team(users)
    team_bet = create_bet(team)

    TrackRefund.new(%{bet_id: team_bet.id})
    |> Oban.insert()

    assert :ok = perform_job(TrackRefund, %{bet_id: team_bet.id})
  end
end
