defmodule PlConnect.Cod.Resource.Session.Changes.CreateUser do
  @moduledoc """
  Ash change, creates an user and set's the token session
  """
  use Ash.Resource.Change

  alias PlConnect.Api

  def create_user do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    {:ok, password} = Ash.Changeset.fetch_argument(changeset, :password)

    {:ok, password_confirmation} = Ash.Changeset.fetch_argument(changeset, :password_confirmation)

    xbl_platform_username = Ash.Changeset.get_argument(changeset, :xbl_platform_username)
    psn_platform_username = Ash.Changeset.get_argument(changeset, :psn_platform_username)
    battlenet_platform_username = Ash.Changeset.get_argument(changeset, :battlenet_platform_username)
    {:ok, email} = Ash.Changeset.fetch_argument(changeset, :email)

    arguments = %{
      password: password,
      password_confirmation: password_confirmation,
      xbl_platform_username: xbl_platform_username,
      psn_platform_username: psn_platform_username,
      battlenet_platform_username: battlenet_platform_username,
      email: email
    }

    case Api.create_user(arguments) do
      {:ok, user} ->
        Ash.Changeset.force_change_attribute(
          changeset,
          :user,
          user
        )

      {:error, error} ->
        Ash.Changeset.add_error(changeset, error.errors)
    end
  end
end
