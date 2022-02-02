defmodule PlConnect.ApiClient.PaypalClientTest do
  use PlConnect.DataCase

  alias PlConnect.ApiClient.PaypalClient

  setup do
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
    end)

    :ok
  end

  test "get_token/0 request the token and then gets from cache" do
    assert {type, access_token} = PaypalClient.get_token()
    assert {type_from_cache, access_token_from_cache} = PaypalClient.get_token()
    assert type == type_from_cache
    assert access_token == access_token_from_cache
  end

  test "get_token/0 request the token and then refresh a new one" do
    assert {_, access_token} = PaypalClient.get_token()
    :timer.sleep(11000)
    assert {_, access_token_refreshed} = PaypalClient.get_token()

    refute access_token == access_token_refreshed
  end

  test "complete_transaction!/3 completes the transaction" do
    {:ok, capture_id, amount} = PaypalClient.complete_transaction!("test_order_id", "test_auth_id")
    assert capture_id == "test_capture_id"
    assert amount == 20
  end

end
