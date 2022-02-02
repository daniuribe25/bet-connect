defmodule PlConnect.Workers.Match.Update.Lazy do
  @moduledoc """
  Updates matches for a given user, it takes into account the last record in database

  This lazy version looks passively for the data since the first response does not have the matching data
  """
  use Oban.Worker,
    queue: :updater,
    priority: 2,
    # do not repeat task when are running
    unique: [
      period: :infinity,
      fields: [:args, :worker],
      keys: [:user_id, :platform, :next_id, :last_match_id],
      states: [:available, :scheduled, :executing, :retryable]
    ]

  alias PlConnect.Api
  alias PlConnect.ApiClient.Utils
  alias PlConnect.ApiClient.CodTrackerGG
  alias PlConnect.Workers.Match.Update.Common

  @max_counter_value 5

  @impl Oban.Worker
  def perform(%Oban.Job{
        args: %{
          "user_id" => user_id,
          "platform" => platform,
          "next_id" => next_id,
          "last_match_id" => last_match_id,
          "counter" => counter
        }
      })
      when counter <= @max_counter_value do
    player_match = Api.get_player_match!(last_match_id)

    username = Utils.get_user_platform_username(player_match.user, platform)

    matches_response = CodTrackerGG.get_user_next_matches!(username, platform, next_id)

    Common.process_to_update(
      player_match,
      matches_response,
      username,
      platform,
      user_id,
      last_match_id,
      next_id,
      counter
    )

    :ok
  end

  def perform(%Oban.Job{args: %{"user_id" => user_id, "platform" => platform}}),
    do: PlConnect.Workers.queue_update_matches(user_id, platform, [:available, :scheduled])

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(20)
end
