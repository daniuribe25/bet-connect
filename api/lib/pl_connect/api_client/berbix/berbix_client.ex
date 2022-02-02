defmodule PlConnect.ApiClient.Berbix do
  @moduledoc """
  Api wrapper for the warzone api for tracker.gg
  """

  @berbix_config Application.get_env(:pl_connect, :berbix_config)

  @origin Application.get_env(:pl_connect, PlConnectWeb.Endpoint)[:url][:host]

  def client(module, keys) do
    middleware = [
      {module, keys},
      {Tesla.Middleware.BaseUrl, "https://api.berbix.com/v0"},
      Tesla.Middleware.JSON,
      {Tesla.Middleware.Headers, [{"Content-Type", "application/json"}, {"Origin", @origin}]}
    ]

    Tesla.client(middleware)
  end

  def create_transaction(user_id) do
    client = client(Tesla.Middleware.BasicAuth, username: @berbix_config[:berbix_username])

    data =
      Jason.encode!(%{
        "customer_uid" => user_id,
        "template_key" => @berbix_config[:berbix_template]
      })

    %{
      "client_token" => client_token,
      "refresh_token" => refresh_token,
      "transaction_id" => transaction_id
    } =
      Tesla.post!(client, "/transactions", data)
      |> (& &1.body).()

    {client_token, refresh_token, transaction_id}
  end

  def get_transaction_tokens(refresh_token) do
    client = client(Tesla.Middleware.BasicAuth, username: @berbix_config[:berbix_username])

    data =
      Jason.encode!(%{
        "refresh_token" => refresh_token
      })

    %{
      "client_token" => client_token,
      "access_token" => access_token
    } =
      Tesla.post!(client, "/tokens", data)
      |> (& &1.body).()

    {access_token, client_token}
  end

  def get_transaction_information(token) do
    client = client(Tesla.Middleware.BearerAuth, token: token)

    %{"verifications" => verifications} =
      Tesla.get!(client, "/transactions")
      |> (& &1.body).()

    %{"details" => details, "photoid" => photoid} = verifications

    %{
      "date_of_birth" => date_of_birth,
      "family_name" => family_name,
      "given_name" => given_name,
      "middle_name" => middle_name
    } = details

    %{"type" => verified_document} = photoid

    {date_of_birth, family_name, given_name, middle_name, verified_document}
  end
end
