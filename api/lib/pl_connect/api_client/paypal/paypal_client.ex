defmodule PlConnect.ApiClient.PaypalClient do
  @moduledoc """
  Api wrapper for the paypal api
  """
  use Tesla

  @paypal_config Application.get_env(:pl_connect, :paypal_config)
  @paypal_cache_table :paypal_cache

  plug Tesla.Middleware.BaseUrl, @paypal_config[:url]
  plug Tesla.Middleware.Headers, [{"accept", "application/json"}]
  plug Tesla.Middleware.JSON

  defp request_token() do
    basic_auth = Base.encode64("#{@paypal_config[:client]}:#{@paypal_config[:secret]}")
    headers = [{"authorization", "Basic #{basic_auth}"}]

    %{
      "token_type" => token_type,
      "access_token" => access_token,
      "expires_in" => expires_in
    } = post!("/v1/oauth2/token/", "grant_type=client_credentials", headers: headers)
      |> (&(&1.body)).()
    expire_date = Timex.now()
      |> Timex.shift(seconds: expires_in)
    {token_type, access_token, expire_date}
  end

  defp get_and_save_token() do
    {token_type, access_token, expire_date} = request_token()
    :ets.insert(@paypal_cache_table, {:paypal_token, token_type, access_token, expire_date})
    {token_type, access_token}
  end

  @doc """

  """
  @spec get_token() :: {String.t(), String.t()}
  def get_token() do
    if :ets.info(@paypal_cache_table) == :undefined do
      :ets.new(@paypal_cache_table, [:set, :public, :named_table])
    end

    case :ets.lookup(@paypal_cache_table, :paypal_token) do
      [{:paypal_token, token_type, access_token, expire_date}] ->
        if Timex.before?(Timex.now(), expire_date) do
          {token_type, access_token}
        else
          get_and_save_token()
        end
      _ ->
        get_and_save_token()
    end
  end

  @spec complete_transaction!(String.t(), String.t()) :: number()
  def complete_transaction!(order_id, authorization_id) do
    {type, access_token} = get_token()
    headers = [{"authorization", "#{type} #{access_token}"}]

    %{"purchase_units" => [%{"amount" => %{"value" => amount}}]} =
      get!("/v2/checkout/orders/#{order_id}", headers: headers)
      |> (&(&1.body)).()

    amount = Float.parse(amount) |> elem(0)

    %{"id" => capture_id} = post!("/v2/payments/authorizations/#{authorization_id}/capture", %{}, headers: headers)
      |> (&(&1.body)).()

    {:ok, capture_id, amount}
  end

end