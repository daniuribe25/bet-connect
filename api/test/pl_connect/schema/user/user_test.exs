defmodule PlConnect.Cod.PlayerMatch.UserTest do
  use PlConnect.DataCase
  use PlConnect.WzrankedMocks

  import Mock
  import PlConnect.TestHelpers

  alias PlConnect.Helpers
  alias PlConnect.Api
  alias PlConnect.Cod.User

  @fields [:id, :psn_platform_username, :email, :password_hash, :phone]

  setup do
    populate_bet_values()
    Tesla.Mock.mock(fn
      %{method: :get, url: "https://api-m.sandbox.paypal.com/v2/checkout/orders/test_order_id"} ->
        %Tesla.Env{status: 200, body: %{
          "id" => "5O190127TN364715T",
          "status" => "PAYER_ACTION_REQUIRED",
          "intent" => "CAPTURE",
          "purchase_units" => [
            %{
              "reference_id" => "d9f80740-38f0-11e8-b467-0ed5f89f718b",
              "amount" => %{
                "currency_code" => "USD",
                "value" => "20.00"
              }
            }
          ]
        }}
      %{method: :post, url: "https://api-m.sandbox.paypal.com/v1/oauth2/token/"} ->
        %Tesla.Env{status: 200, body: %{
          "access_token" => "test_token#{:rand.uniform(1000)}",
          "expires_in" => 10,
          "token_type" => "custom_for_test"
        }}
      %{method: :post, url: "https://api-m.sandbox.paypal.com/v2/payments/authorizations/test_auth_id/capture"} ->
        %Tesla.Env{status: 200, body: %{
          "id" => "test_capture_id",
          "status" => "COMPLETED"
        }}
      %{method: :post, url: "https://api.segment.io/v1/track"} -> %Tesla.Env{status: 200, body: %{}}
      %{method: :post, url: "https://api.segment.io/v1/identify"} -> %Tesla.Env{status: 200, body: %{}}
    end)

    :ok
  end

  test "update_update_profile/2 updates the user profile" do
    [user] = create_players(1)
    new_data = %{
      phone: "9998887775"
    }

    assert %User{} = user = Api.update_update_profile!(user, new_data)
    assert_fields(user, new_data, Map.keys(new_data))
  end

  test "update_user_wallet/2 updates the user wallet" do
    [user] = create_players(1)

    assert %User{wallet: %{funds: funds}} = Api.update_user_wallet!(user, %{wallet: %{funds: 200}})
    assert funds == 200
  end

  test "get_users!/1 returns the user with given id" do
    [user] = create_players(1)

    assert_fields(Api.get_user!(user.id), user, @fields)
  end

  test "create_user/1 with valid data creates a " do
    [user] = create_players(1)

    assert_fields(Api.get_user!(user.id), user, @fields)
  end

  test "create_user/1 with invalid data returns changeset error" do
    assert {:error, %Ash.Error.Invalid{}} = Api.create_user(%{platform_username: 21})
  end

  test "delete_user/1 deletes the user" do
    [user] = create_players(1)

    Api.get_wzranked_probabilities!(user.id)
    |> Enum.each(&Api.destroy!/1)
    |> IO.inspect

    assert :ok = Api.delete_user!(user)
    assert_raise Ash.Error.Query.NotFound, fn -> Api.get_user!(user.id) end
  end

  test "disband teams with more-equal than 6 hours" do
    [owner] = create_players(1)

    list_players = create_players(3)
    players = [owner | list_players]

    team = create_team(players)

    # Check if the team has the same time that was created
    assert Helpers.format_dates(team.updated_at) == Helpers.format_dates(DateTime.utc_now())
    assert team.is_active == true

    # Update the date of the team
    new_date = Helpers.less_hours(DateTime.utc_now(), 6)
    team_updated = Ecto.Changeset.change(team, updated_at: new_date)
    PlConnect.Repo.update(team_updated)

    # Check if there are old teams
    assert Helpers.format_date(team.updated_at) != Helpers.format_date(new_date)

    # Apply the validation for the disband
    Api.current_user!([owner], actor: owner)
  end

  test "paypal_transaction_process/3 process the payment data and add the amount to the user" do
    [user] = create_players(1)
    user_modified = Api.paypal_transaction_process!(user, "test_order_id", "test_auth_id")

    assert [transaction] = Api.get_wallet_transactions!()
    assert transaction.status == :deposit
    assert transaction.prev_wallet_balance == user.wallet.funds
    assert transaction.post_wallet_balance == user_modified.wallet.funds
    assert transaction.metadata["amount"] == user_modified.wallet.funds - user.wallet.funds
    assert transaction.metadata["paypal_order_id"] == "test_order_id"
    assert transaction.metadata["paypal_authorization_id"] == "test_auth_id"

    assert {:ok, report} = Api.get_report_event(user.id, "deposited")
    assert report.user_id == user.id
    assert report.event_name == "deposited"
  end

  test "update_user_flag should change the flag :disallow_bets from false to true" do
    [user] = create_players(1)

    refute user.flags.disallow_bets

    user = Api.update_user_flag!(user, :disallow_bets, "true", :boolean)

    assert user.flags.disallow_bets
  end

  test "user cannot create bets with the flag :disallow_bets on true" do
    [leader | _] = players = create_players(3)

    Api.update_user_flag!(leader, :disallow_bets, "true", :boolean)

    team = create_team(players)

    assert_raise Ash.Error.Invalid,
      ~r/User unable to place bets at this time. Contact support for help/,
      fn ->
        create_bet(team)
      end
  end

end
