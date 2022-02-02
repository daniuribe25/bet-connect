defmodule PlConnect.Workers.Profile.Upsert do
  @moduledoc """
  Inserts and updates the data for user profiles
  """
  use Oban.Worker,
    queue: :default,
    priority: 0,
    # do not repeat task when are running
    unique: [
      period: :infinity,
      fields: [:args, :worker],
      keys: [:user_id, :username, :platform],
      states: [:available, :scheduled, :executing, :retryable]
    ]

  alias PlConnect.Api
  alias PlConnect.ApiClient.CodTrackerGG

  # 30 min in seconds
  @update_after 1800

  @impl Oban.Worker
  def perform(%Oban.Job{
        args: %{"user_id" => user_id, "username" => username, "platform" => platform}
      }) do
    # get user
    user = Api.get_user!(user_id)

    # get profile info
    profile_data = CodTrackerGG.get_user_profile!(username, platform)

    if is_nil(profile_data) do
      # TODO what do we do when the user does not have any profile data?
      schedule_profile_update(user_id, username, platform)
    else
      # upsert the info
      record = get_profile_info_record(profile_data)

      case platform do
        "xbl" -> Api.update_user_xbl_cod_profile!(user, %{cod_profile: record})
        "psn" -> Api.update_user_psn_cod_profile!(user, %{cod_profile: record})
        "battlenet" -> Api.update_user_battlenet_cod_profile!(user, %{cod_profile: record})
      end

      schedule_profile_update(user_id, username, platform)
    end

    :ok
  end

  defp schedule_profile_update(user_id, username, platform) do
    %{user_id: user_id, username: username, platform: platform}
    |> __MODULE__.new(schedule_in: @update_after)
    |> Oban.insert!()
  end

  defp get_profile_info_record(data) do
    overview = Enum.find(data["segments"], &(&1["type"] == "overview"))

    %{json: data, kda_ratio: overview["stats"]["kdRatio"]["value"]}
  end
end
