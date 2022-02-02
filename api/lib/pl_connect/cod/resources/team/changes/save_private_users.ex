defmodule PlConnect.Cod.Resource.Team.Changes.SavePrivateUsers do
  @moduledoc """
  Ash change, Resource for find and save the private users
  """
  use Ash.Resource.Change

  require Ash.Query

  alias PlConnect.Cod.Feature
  alias PlConnect.Helpers
  alias PlConnect.ApiClient.WzRanked

  def save_private_users do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn _changeset, record ->
      users = evaluate_profiles(record.teammates)
      record = Ash.Resource.Info.put_metadata(record, :private_users, %{private_users: users})

      {:ok, record}
    end)
  end

  defp evaluate_profiles(teammates) do
    result =
      Enum.map(teammates, fn teammate ->
        user = teammate.user
        platform = Helpers.get_platform(user)
        gamertag = Helpers.get_username_platform(user)

        {_, is_visible?} = account_visible(gamertag, platform)

        %{username_platform: gamertag, platform: platform, is_visible: is_visible?}
      end)

    result
    |> Enum.filter(fn profile -> !profile.is_visible end)
    |> Enum.map(&(%{username_platform: &1.username_platform, platform: &1.platform}))
  end

  def account_visible(gamertag, platform) do
    case match_count(gamertag, platform) do
      0 -> # get users from wzranked api
      case WzRanked.get_uno_wzranked!(gamertag, platform) do
        res when res in [:private_profile, :not_found, :not_enough_data] ->
          PlConnect.ApiClient.CodTrackerGG.get_user_profile!(gamertag, platform)
          |> is_nil()
          |> Kernel.!()
          |> (&({:cod_tracker, &1})).()
        _ -> {:wzranked, true}
      end
      _ -> {:stored_matches, true}
    end
  end

  defp match_count(username, pltfm) do
    last_day = Timex.now()
      |> Timex.shift(days: -14)
      |> Timex.to_datetime()

    PlConnect.Cod.PlayerMatch
    |> Ash.Query.filter(platform_username == ^username and platform == ^pltfm and match_date >= ^last_day)
    |> PlConnect.Api.read!()
    |> length()
  end

end
