defmodule PlConnect.BetRefundTest do
  use PlConnect.DataCase, async: false
  use Oban.Testing, repo: PlConnect.Repo
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  require Ash.Query
  alias PlConnect.Api

  setup do
    populate_bet_values()
  end

  test "should make the refund of the bet when is in waiting" do
    players = create_players(4)
    team = create_team(players)
    bet = create_bet(team)

    response = Api.refund_bet!(bet)
    assert :refunded == response.status
  end

  test "should make the refund of the bet when is completed" do
    players = create_players(4)
    team = create_team(players)
    bet = create_bet(team)
    |> Api.set_user_bet_complete!()

    response = Api.refund_bet!(bet)
    assert :refunded == response.status
  end

  test "should ensure if the balance was refunded correctly" do
    players = create_players(4)

    team = create_team(players)
    prev_wallet = Enum.map(team.teammates, fn teammate ->
      teammate.user.wallet.funds
    end)

    bet = create_bet(team)
    |> Api.set_user_bet_complete!()

    bet_history =
      PlConnect.Cod.UserBetHistory
      |> Ash.Query.filter(id == ^bet.id)
      |> Ash.Query.load(team: [teammates: [:user]])
      |> PlConnect.Api.read_one!()

    wallet_bet = Enum.map(bet_history.team.teammates, fn teammate ->
      teammate.user.wallet.funds
    end)

    # Check if the wallet has had any changes after completing the Bet
    assert prev_wallet != wallet_bet

    response = Api.refund_bet!(bet)
    bet_updated =
      Api.get_bet_history!(response.id)

    post_wallet = Enum.map(bet_updated.team.teammates, fn teammate ->
      teammate.user.wallet.funds
    end)

    # Check if the bet was refunded
    assert :refunded == response.status

    # Check the wallet after the refund
    assert prev_wallet == post_wallet
  end
end
