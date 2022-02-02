defmodule PlConnect.Cod.Bet.BetTest do
  use PlConnect.DataCase
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  setup do
    populate_bet_values()
  end

  test "should not be able to make a bet is user has negative balance" do
    players = create_players(4, -1)
    team = create_team(players)
    assert_raise Ash.Error.Invalid,
                 ~r/doesn´t have enough money for the bet./,
                 fn ->
                   create_bet(team)
                 end
  end

  test "should not be able to make a bet if user has no balance" do
    players = create_players(4, 0)
    team = create_team(players)
    assert_raise Ash.Error.Invalid,
                 ~r/doesn´t have enough money for the bet./,
                 fn ->
                   create_bet(team)
                 end
  end


  test "should not be able to make a bet that goes belows users balance" do
    players = create_players(4, 1) #bet is 8 dollars.
    team = create_team(players)
    assert_raise Ash.Error.Invalid,
                 ~r/doesn´t have enough money for the bet./,
                 fn ->
                   create_bet(team)
                 end
  end

  test "should be able to make the bet" do
    players = create_players(4, 100)

    team = create_team(players)
    assert _ = create_bet(team)
  end

end
