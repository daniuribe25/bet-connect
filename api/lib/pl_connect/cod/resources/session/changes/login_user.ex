defmodule PlConnect.Cod.Resource.Session.Changes.LoginUser do
  @moduledoc """
  Ash change, set's the given user to the resource
  """
  use Ash.Resource.Change
  require Ash.Query

  alias PlConnect.Helpers
  alias PlConnect.Api
  alias PlConnect.Cod.User
  alias PlConnect.ApiClient.WzRanked

  def login_user() do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    {func, value} = get_login_id(changeset)
    {:ok, password} = Ash.Changeset.fetch_argument(changeset, :password)
    case apply(Api, func, [value]) do
      {:ok, nil} ->
        error(:login, changeset)

      {:ok, %User{} = user} ->
        login_user(changeset, user, password)

      {:error, _} ->
        error(:login, changeset)
    end
  end

  defp get_login_id(changeset) do
    get_phone = fn changeset ->
      {:ok, phone} = Ash.Changeset.fetch_argument(changeset, :phone)
      {:get_user_by_phone, phone}
    end
    case Ash.Changeset.fetch_argument(changeset, :email) do
      {:ok, email} -> if email == "" or is_nil(email), do: get_phone.(changeset), else: {:get_user_by_email, email}
      _ -> get_phone.(changeset)
    end
  end

  defp login_user(changeset, user, password) do
    if user.step_register == :step_3 and Argon2.verify_pass(password, user.password_hash) do
      {_, gamertag, platform, _} = Helpers.iterate_platforms(user)
      uno_res =  WzRanked.get_uno_wzranked!(gamertag, platform)
      user = case {user, uno_res} do
          {user, res} when res in [:private_profile, :not_found] -> user
          {user, uno} when is_nil(user.wzranked_uno) ->
            %{user_id: user.id, wzranked_uno: uno, platform: platform}
            |> PlConnect.Workers.Profile.Wzranked.new(schedule_in: 5)
            |> Oban.insert!()
            Api.update_wzranked_uno!(user, uno)
          {user, _} -> user
        end

      Ash.Changeset.force_change_attribute(
        changeset,
        :user,
        user
      )
    else
      type_error = if user.private_profile, do: :profile, else: :login
      error(type_error, changeset)
    end
  end

  defp error(:profile, changeset) do
    Ash.Changeset.add_error(changeset,
      field: :token,
      message: "Private profile: make sure your profile is public from callofduty.com. Navigate to your profile’s linked accounts section and set your account Searchable and Data Visible to ‘ALL’"
    )
  end
  defp error(:login, changeset) do
    Ash.Changeset.add_error(changeset,
      field: :token,
      message:
        "If you forgot your password. Please click the blue help button in the bottom right corner to get help resetting your password"
    )
  end
end
