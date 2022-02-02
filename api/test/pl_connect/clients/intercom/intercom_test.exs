defmodule PlConnect.IntercomTest do
  use PlConnect.DataCase, async: false
  use PlConnect.WzrankedMocks

  import Mock
  import PlConnect.TestHelpers

  alias PlConnect.Intercom.ApiClient

  setup do
    populate_bet_values()
    Tesla.Mock.mock_global(fn
      %{method: :post, url: "https://api.intercom.io/conversations", body: _} ->
        %Tesla.Env{status: 200, body: %{"id" => "test"}}
    end)

    :ok
  end

  test "test team_won_to_much_money/1" do
    users = create_players(3)
    team = create_team(users)

    assert {:ok, %{status: 200}} = ApiClient.team_won_to_much_money(team)
  end
end