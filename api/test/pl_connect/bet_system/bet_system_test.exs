defmodule PlConnect.Cod.BetSystemTest do
  use PlConnect.DataCase
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  alias PlConnect.Api

  setup do
    populate_bet_values()
    :ok
  end

  test "probabilities_generated for solos" do
    Api.create_feature(%{
      description: "description",
      domain: :wzranked_engine,
      value: "true",
      type: :boolean
    })

    players = create_players(2)
    team = create_team(players, :legend, :rebirth_island)

    assert team.probabilities_calculated.bet_lines.main == [
             %{goal: 1, level: 1, payout: 1.0},
             %{goal: 2, level: 2, payout: 2.0},
             %{goal: 3, level: 3, payout: 3.0}
           ]
  end
end
