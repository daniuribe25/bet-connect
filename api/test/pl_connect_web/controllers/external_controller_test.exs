defmodule PlConnectWeb.ExternalControllerText do
  use PlConnectWeb.ConnCase
  use Oban.Testing, repo: PlConnect.Repo
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  @header "test_token"

  setup do
    populate_bet_values()

    Tesla.Mock.mock(fn
      %{method: :get, url: "http://pl-dev-be-pl-tournaments-1366517835.us-east-1.elb.amazonaws.com/tournament/all-active?userId=" <> _} ->
        %Tesla.Env{status: 200, body: [%{
          "id" => 1,
          "description" => "Test Description",
          "tournamentConfigId" => 8,
          "tournamentStatusLastUpdated" => "2021-10-27T10:00:34.985Z",
          "payoutStatus" => "PENDING",
          "tournamentStatusId" => 1,
          "tournamentConfig" => %{
            "id" => 8,
            "configJson" => %{
              "gameInfo" => %{
                "gameId" => 1,
                "gameName" => "Call Of Duty: Warzone",
                "gameModeId" => 4,
                "gameModeName" => "Verdansk",
                "gameModeOptions" => %{
                  "teamSizes" => [2, 3]
                }
              },
              "description" => "Test Description",
              "endDateTime" => "2021-10-27T19:30:00.000Z",
              "startTypeId" => 1,
              "payoutTypeId" => 1,
              "entryFeeValue" => 10,
              "payoutAmounts" => [
                %{"value" => 90, "placement" => 1},
                %{"value" => 50, "placement" => 2},
                %{"value" => 20, "placement" => 3}
              ],
              "startDateTime" => "2021-10-27T18:00:00Z",
              "entryFeeTypeId" => 1,
              "scoringStyleId" => 1,
              "prizeStyleTypeId" => 1,
              "tournamentLength" => 90,
              "maximumTotalTeams" => 100,
              "minimumTotalTeams" => 1
            },
            "isDeleted" => false
          },
          "tournamentStatus" => "NOT STARTED",
          "tournamentTeams" => []
        }]}
      %{method: :get, url: "http://pl-dev-be-pl-tournaments-1366517835.us-east-1.elb.amazonaws.com/tournament/by-id?tournamentId=1" <> _} ->
        %Tesla.Env{status: 200, body: %{
          "id" => 1,
          "description" => "Test Description",
          "tournamentConfigId" => 8,
          "tournamentStatusLastUpdated" => "2021-10-27T10:00:34.985Z",
          "payoutStatus" => "PENDING",
          "tournamentStatusId" => 1,
          "tournamentConfig" => %{
            "id" => 8,
            "configJson" => %{
              "gameInfo" => %{
                "gameId" => 1,
                "gameName" => "Call Of Duty: Warzone",
                "gameModeId" => 4,
                "gameModeName" => "Verdansk",
                "gameModeOptions" => %{
                  "teamSizes" => [2, 3]
                }
              },
              "description" => "Test Description",
              "endDateTime" => "2021-10-27T19:30:00.000Z",
              "startTypeId" => 1,
              "payoutTypeId" => 1,
              "entryFeeValue" => 100,
              "payoutAmounts" => [
                %{"value" => 90, "placement" => 1},
                %{"value" => 50, "placement" => 2},
                %{"value" => 20, "placement" => 3}
              ],
              "startDateTime" => "2021-10-27T18:00:00Z",
              "entryFeeTypeId" => 1,
              "scoringStyleId" => 1,
              "prizeStyleTypeId" => 1,
              "tournamentLength" => 90,
              "maximumTotalTeams" => 100,
              "minimumTotalTeams" => 1
            },
            "isDeleted" => false
          },
          "tournamentStatus" => "NOT STARTED",
          "tournamentTeams" => []
        }}
      %{method: :post, url: "http://pl-dev-be-pl-tournaments-1366517835.us-east-1.elb.amazonaws.com/user/join-tournament"} ->
        %Tesla.Env{status: 201, body: %{
          "id" => 1,
          "description" => "Test Description",
          "tournamentConfigId" => 8,
          "tournamentStatusLastUpdated" => "2021-10-27T10:00:34.985Z",
          "payoutStatus" => "PENDING",
          "tournamentStatusId" => 1,
          "tournamentConfig" => %{
            "id" => 8,
            "configJson" => %{
              "gameInfo" => %{
                "gameId" => 1,
                "gameName" => "Call Of Duty: Warzone",
                "gameModeId" => 4,
                "gameModeName" => "Verdansk",
                "gameModeOptions" => %{
                  "teamSizes" => [2, 3]
                }
              },
              "description" => "Test Description",
              "endDateTime" => "2021-10-27T19:30:00.000Z",
              "startTypeId" => 1,
              "payoutTypeId" => 1,
              "entryFeeValue" => 100,
              "payoutAmounts" => [
                %{"value" => 90, "placement" => 1},
                %{"value" => 50, "placement" => 2},
                %{"value" => 20, "placement" => 3}
              ],
              "startDateTime" => "2021-10-27T18:00:00Z",
              "entryFeeTypeId" => 1,
              "scoringStyleId" => 1,
              "prizeStyleTypeId" => 1,
              "tournamentLength" => 90,
              "maximumTotalTeams" => 100,
              "minimumTotalTeams" => 1
            },
            "isDeleted" => false
          },
          "tournamentStatus" => "NOT STARTED",
          "tournamentTeams" => []
        }}
      %{method: :get, url: "http://pl-dev-be-pl-tournaments-1366517835.us-east-1.elb.amazonaws.com/tournament/match-history/notify"} ->
        %Tesla.Env{status: 200, body: %{"code" => 204}}
    end)

    :ok
  end

  test "get all matches", %{conn: conn} do
    players = create_players(4)
    team = create_team(players)

    first_bet = create_bet(team)
    insert_matches(players, first_bet, :noob)

    bet = create_bet(team)
    insert_matches(players, bet, :rookie)

    bet = create_bet(team)
    insert_matches(players, bet, :legend)

    bet = create_bet(team)
    insert_matches(players, bet, :diamond)

    data = %{
      "users" => players |> Enum.map(&(&1.id)),
      "start_date" => first_bet.inserted_at |> to_string(),
      "end_date" => DateTime.add(bet.inserted_at, 30, :second) |> to_string()
    }
    conn = conn
      |> put_req_header("authorization", @header)
      |> get(Routes.external_path(conn, :matches), data)

    assert %{"data" => list} = json_response(conn, 200)
    assert length(list) == 4
  end

  test "get all matches separate teams", %{conn: conn} do
    # team 1
    players1 = create_players(3)
    team1 = create_team(players1)

    first_bet = create_bet(team1)
    insert_matches(players1, first_bet, :diamond, 9999991)

    bet = create_bet(team1)
    insert_matches(players1, bet, nil, 9999992)

    # team 2
    players2 = create_players(3)
    team2 = create_team(players2)

    bet = create_bet(team2)
    insert_matches(players2, bet, :noob, 9999991)

    bet = create_bet(team2)
    insert_matches(players2, bet, :rookie, 9999992)

    data = %{
      "users" => players1 ++ players2 |> Enum.map(&(&1.id)),
      "start_date" => first_bet.inserted_at |> to_string(),
      "end_date" => DateTime.add(bet.inserted_at, 30, :second) |> to_string()
    }
    conn = conn
      |> put_req_header("authorization", @header)
      |> get(Routes.external_path(conn, :matches), data)

    assert %{"data" => list} = json_response(conn, 200)
    assert length(list) == 2
  end

  test "schedule all updates from external resource", %{conn: conn} do
    players = create_players(4)

    data = %{"users" => players |> Enum.map(&(&1.id)), "tourney_id" => "tournament_id"}

    conn
    |> put_req_header("authorization", @header)
    |> post(Routes.external_path(conn, :schedule), data)

    players
    |> Enum.map(&({&1.id, PlConnect.Helpers.get_user_platforms(&1) |> List.first()}))
    |> Enum.each(fn {user_id, platform} ->
      assert_enqueued(worker: PlConnect.Workers.Match.Workflow.Update, args: %{user_id: user_id, platform: platform})
    end)
  end

  test "public api should work on join tournament", %{conn: conn} do
    [leader | _] = players = create_players(3)
    team = create_team(players)

    data = %{
      "team_id" => team.id
    }

    token = PlConnect.Cod.Sessions.generate_token(leader.id)

    conn = conn
      |> put_req_header("authorization", "bearer #{token}")
      |> post(Routes.external_path(conn, :join, 1), data)

    assert %{"data" => %{"result" => %{}}} = json_response(conn, 201)
  end

  test "public api should work on leave tournament", %{conn: conn} do
    [leader | _] = players = create_players(3)
    team = create_team(players)

    data = %{
      "team_id" => team.id
    }

    token = PlConnect.Cod.Sessions.generate_token(leader.id)

    conn = conn
      |> put_req_header("authorization", "bearer #{token}")
      |> post(Routes.external_path(conn, :join, 1), data)

    assert %{"data" => %{"result" => %{}}} = json_response(conn, 201)

    Tesla.Mock.mock(fn
      %{method: :get, url: "http://pl-dev-be-pl-tournaments-1366517835.us-east-1.elb.amazonaws.com/tournament/by-id?tournamentId=1"} ->
        %Tesla.Env{status: 200, body: %{
          "id" => 1,
          "tournamentConfig" => %{
            "configJson" => %{
              "gameInfo" => %{
                "gameModeOptions" => %{
                  "teamSizes" => [2, 3]
                }
              },
              "entryFeeValue" => 100
            }
          },
          "tournamentStatus" => "NOT STARTED",
          "tournamentTeams" => [team.id]
        }}
      %{method: :post, url: "http://pl-dev-be-pl-tournaments-1366517835.us-east-1.elb.amazonaws.com/user/join-tournament", __module__: PlConnect.ApiClient.TourneysClient} ->
        %Tesla.Env{status: 201, body: %{
          "id" => 1,
          "tournamentConfig" => %{
            "configJson" => %{
              "gameInfo" => %{
                "gameModeOptions" => %{
                  "teamSizes" => [2, 3]
                }
              },
              "entryFeeValue" => 100
            }
          },
          "tournamentStatus" => "NOT STARTED",
          "tournamentTeams" => [team.id]
        }}
      %{method: :post, url: "http://pl-dev-be-pl-tournaments-1366517835.us-east-1.elb.amazonaws.com/user/leave-tournament", __module__: PlConnect.ApiClient.TourneysClient} ->
        %Tesla.Env{status: 201, body: %{
          "id" => 1,
          "tournamentConfig" => %{
            "configJson" => %{
              "gameInfo" => %{
                "gameModeOptions" => %{
                  "teamSizes" => [2, 3]
                }
              },
              "entryFeeValue" => 100
            }
          },
          "tournamentStatus" => "NOT STARTED",
          "tournamentTeams" => []
        }}
    end)

    conn = conn
      |> recycle()
      |> put_req_header("authorization", "bearer #{token}")
      |> post(Routes.external_path(conn, :leave, 1), data)

    assert %{"data" => %{"result" => %{}}} = json_response(conn, 201)
  end

  test "public api should work on get all tournaments", %{conn: conn} do
    [user] = create_players(1)

    token = PlConnect.Cod.Sessions.generate_token(user.id)

    conn = conn
           |> put_req_header("authorization", "bearer #{token}")
           |> get(Routes.external_path(conn, :all))

    assert %{"data" => %{"tournaments" => data}} = json_response(conn, 200)
    assert length(data) == 1
  end

  test "public api should work on get one tournament by id", %{conn: conn} do
    [user] = create_players(1)

    token = PlConnect.Cod.Sessions.generate_token(user.id)

    conn = conn
           |> put_req_header("authorization", "bearer #{token}")
           |> get(Routes.external_path(conn, :get, 1))

    assert %{"data" => %{"tournament" => data}} = json_response(conn, 200)
    assert data["id"] == 1
  end

end
