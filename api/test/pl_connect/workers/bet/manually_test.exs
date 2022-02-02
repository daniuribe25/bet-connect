defmodule PlConnect.BetManuallyTest do
  use PlConnect.DataCase, async: false
  use Oban.Testing, repo: PlConnect.Repo
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  alias PlConnect.Api

  setup do
    populate_bet_values()
  end

  test "should make the bet placed manually is working properly" do
    players = create_players(4)
    team = create_team(players)
    bet = create_bet(team)

    response = Api.set_bet_results!(bet, %{
      won_main_bet: true,
      won_kills_bet: true,
      won_placement_bet: true,
      won_match_bet: true,
      won_damage_bet: true
    })
    assert :complete == response.status
  end

end
