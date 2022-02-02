defmodule PlConnect.Berbix.Change do
  @moduledoc """
  Prepare the data querying the api and bringing the desired result
  """
  use Ash.Resource.Change

  # 5 min in seconds
  @notify_in 60 * 5

  alias PlConnect.Api
  alias PlConnect.Cod.User
  alias PlConnect.ApiClient.Berbix

  def berbix_change do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    {:ok, user_id} = Ash.Changeset.fetch_argument(changeset, :user_id)
    case Api.get_user(user_id) do
      {:ok, %User{refresh_berbix_token: nil} = user} ->
        {client_token, refresh_token, transaction_id} = Berbix.create_transaction(user_id)
        Api.update_berbix_data(user, refresh_token, transaction_id)

        PlConnect.Workers.Berbix.NotifyInactivity.new(%{user_id: user_id}, schedule_in: @notify_in)
        |> Oban.insert()

        Ash.Changeset.force_change_attribute(changeset, :token, client_token)
      {:ok, %User{refresh_berbix_token: refresh_berbix_token}} ->
        {_, client_token} = Berbix.get_transaction_tokens(refresh_berbix_token)
        Ash.Changeset.force_change_attribute(changeset, :token, client_token)
      _ ->
        Ash.Changeset.add_error(changeset,
          field: :user_id,
          message: "user not found"
        )
    end
  end
end
