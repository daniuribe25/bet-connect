defmodule PlConnect.Cod.PlayerMatch.TeamTest do
  use PlConnect.DataCase
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  alias PlConnect.Api
  alias PlConnect.InviteLobby

  setup do
    populate_bet_values()
  end

  test "disband_team/1 disables the team and delete the lobby" do
    players = create_players(3)

    team =
      create_team(players)
      |> Api.disband_team!()

    assert false == team.is_active
    assert nil == InviteLobby.get_lobby(team.owner_id)
  end

  test "create_team/1 with 2 elements" do
    players = create_players(2)
    team = create_team(players)
    assert length(team.teammates) == 2
  end

#  test "check if the users have their profile inactives" do
#    players = create_players(2)
#    team = create_team(players)
#    # always return true because there are mocks users
#    assert length(team.private_users) == length(team.teammates)
#  end

  #  Work in progress
  #  test "set_team_bets/2 disables the team and delete the lobby" do
  #    players = create_players(3)
  #    team = create_team(players)
  #
  #    IO.inspect Api.set_team_bets(team, %{bets: @team_probabilities})
  #  end

  test "create_team/1 and verify data on 50% harder" do
    players = create_players(2, 100, 0.5)
    team = create_team(players)

    assert team.probabilities.bet_category == :legend
    assert team.probabilities.game_mode == :verdansk

    lines = [:main, :kills, :placement, :damage, :match]

    Enum.each(lines, fn type ->
      line = Map.get(team.probabilities.bet_lines, type) |> Enum.at(0)
      goal = case type do
        :damage -> 800
        :kills -> 10
        :main -> 8
        :match -> 6
        :placement -> 5
      end
      assert line.goal == goal
      assert line.level == 0
      assert line.payout == 6
    end)
    Enum.each(lines, fn type ->
      line = Map.get(team.probabilities_calculated.bet_lines, type) |> Enum.at(0)
      goal = case type do
        :damage -> 840
        :kills -> 8
        :main -> 7
        :match -> 8
        :placement -> 7
      end
      assert line.goal == goal
      assert line.level == 0
      assert line.payout == 6
    end)
  end

  test "create_team/1 on rookie and verify data" do
    players = create_players(2)
    team = create_team(players, :rookie)

    assert team.probabilities.bet_category == :rookie
    assert team.probabilities.game_mode == :verdansk

    [:main, :kills, :placement, :damage, :match]
    |> Enum.each(fn type ->
      line = Map.get(team.probabilities.bet_lines, type) |> Enum.at(0)
      goal = case type do
        :damage -> 400
        :kills -> 5
        :main -> 4
        :match -> 12
        :placement -> 9
      end
      assert line.goal == goal
      assert line.level == 0
      assert line.payout == 6
    end)
  end

  test "create_team/1 on diamond and verify data" do
    players = create_players(2)
    team = create_team(players, :diamond)

    assert team.probabilities.bet_category == :diamond
    assert team.probabilities.game_mode == :verdansk

    [:main, :kills, :placement, :damage, :match]
    |> Enum.each(fn type ->
      line = Map.get(team.probabilities.bet_lines, type) |> Enum.at(0)
      goal = case type do
        :damage -> 1200
        :kills -> 15
        :main -> 12
        :match -> 4
        :placement -> 3
      end
      assert line.goal == goal
      assert line.level == 0
      assert line.payout == 6
    end)
  end

  test "create_team/1 with KDA above max kda and return error" do
    # todo: try to play rebirth over max KDA.
    players = create_players(2)

    players
    |> Enum.each(fn player ->
      Api.update_user_psn_cod_profile(player, %{
        cod_profile: %{
          "json" => %{
            "platformInfo" => %{
              "platformUserIdentifier" => player.psn_platform_username
            }
          },
          "kda_ratio" => 5.1
        }
      })
    end)

    assert_raise Ash.Error.Invalid,
                 ~r/Sorry, This game mode is not available for this team./,
                 fn ->
                   create_team(players, :diamond)
                 end
  end

  test "should not be able to play 1 players on rebirth" do
    players = create_players(1)

    assert_raise Ash.Error.Invalid,
                 ~r/This mode requires at least 2 players/,
                 fn ->
                  create_team(players, :legend, :rebirth_island)
                 end
  end
end
