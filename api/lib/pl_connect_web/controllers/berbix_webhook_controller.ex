defmodule PlConnectWeb.BerbixWebohookController do
  @moduledoc """
    Manages the views for admin login
  """
  use PlConnectWeb, :controller
  alias PlConnect.ApiClient.Berbix
  alias PlConnect.Api
  alias PlConnect.Segment

  def index(conn, %{"customer_uid" => customer_uid, "action" => action}) do
    age_verified = action == "accept"

    user = Api.get_user!(customer_uid)
      |> Api.update_user_age_verified(%{"age_verified" => age_verified})

    Segment.track("berbix verification completed", user.id, %{
      result: action
    })

    if action == "accept" do
      {access_token, _client_token} = Berbix.get_transaction_tokens(user.refresh_berbix_token)
      {
        date_of_birth,
        family_name,
        given_name,
        middle_name,
        verified_document
      } = Berbix.get_transaction_information(access_token)

      Api.update_user_verified(user, %{
        "date_of_birth" => date_of_birth,
        "family_name" => family_name,
        "given_name" => given_name,
        "middle_name" => middle_name,
        "verified_document" => verified_document
      })
    end

    conn
    |> html("")
  end
end
