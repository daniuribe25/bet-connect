defmodule PlConnect.DisbandOldTeamsTest do
  use PlConnect.DataCase, async: false
  use Oban.Testing, repo: PlConnect.Repo
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers
  import Mock

  alias PlConnect.Cod.Team
  alias PlConnect.Workers.DisbandOldTeams
  alias PlConnect.Api

  require Ash.Query
  require Ash.Changeset

  setup do
    populate_bet_values()
  end

  test "should not disband teams made within last 3 hours." do
    create_players(4)
    |> create_team(:rookie)

    %{}
    |> DisbandOldTeams.new()
    |> Oban.insert()

    assert_enqueued(worker: DisbandOldTeams)
    assert %{success: 1, failure: 0} = Oban.drain_queue(queue: :default, with_scheduled: true)
    assert [] = all_enqueued(worker: DisbandOldTeams)

    teams =
      Team
      |> Ash.Query.filter(is_active == true)
      |> Api.read!()

    assert 1 == Enum.count(teams)
  end

  test "should disband teams older then 6 hours" do
    create_players(4)
    |> create_team(:rookie)

    seven_hours_ago =
      Timex.now()
      |> Timex.shift(hours: -7)

    with_mock DateTime, [:passthrough], utc_now: fn -> seven_hours_ago end do
      create_players(4)
      |> create_team(:rookie)
    end

    %{}
    |> DisbandOldTeams.new()
    |> Oban.insert()

    assert_enqueued(worker: DisbandOldTeams)
    assert %{success: 1, failure: 0} = Oban.drain_queue(queue: :default, with_scheduled: true)
    assert [] = all_enqueued(worker: DisbandOldTeams)

    teams =
      Team
      |> Ash.Query.filter(is_active == true)
      |> Api.read!()

    assert 1 == Enum.count(teams)
  end
end
