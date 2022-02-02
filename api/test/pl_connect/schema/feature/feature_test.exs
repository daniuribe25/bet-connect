defmodule PlConnect.Cod.Feature.FeatureTest do
  use PlConnect.DataCase
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  alias PlConnect.Api
  alias PlConnect.Cod.Feature

  setup do
    populate_bet_values()
  end

  test "create/update feature" do
    feature_created =
      Api.create_feature(%{
        description: "description",
        domain: :stop_bets,
        value: "true",
        type: :boolean
      })
    assert {:ok, %Feature{} = create_feature} = feature_created

    feature_updated =
      Api.update_feature(create_feature, %{
        value: "false"
      })
    assert {:ok, %Feature{}} = feature_updated
  end

  test "user cannot create bets when the feature flat" do
    players = create_players(3)
    team = create_team(players)

    Api.create_feature(%{
      description: "description",
      domain: :stop_bets,
      value: "false",
      type: :boolean
    })

    assert_raise Ash.Error.Invalid,
                 ~r/Closed bets, try again later. Contact support for help/,
                 fn ->
                   create_bet(team)
                 end
  end

end
