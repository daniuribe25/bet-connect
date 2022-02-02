defmodule PlConnect.Workers.Match.Insert do
  @moduledoc """
  Ran ONLY when an user does not have any match info, this is more intensive since obtains more data at a faster rate than updating
  """
  use Oban.Worker,
    queue: :inserter,
    priority: 0,
    # do not repeat task when are running
    unique: [
      period: :infinity,
      fields: [:args, :worker],
      keys: [:user_id, :username, :platform],
      states: [:available, :scheduled, :executing, :retryable]
    ]

  alias PlConnect.ApiClient.CodTrackerGG
  alias PlConnect.Workers.Match.Insert.Common

  # keep this low as possible, each request takes 700-2500 ms so it's very slow sometimes
  @pages_to_query 3

  @impl Oban.Worker
  def perform(%Oban.Job{
        args: %{"user_id" => user_id, "username" => username, "platform" => platform}
      }) do
    # get a wide range of matches
    {next_id, matches} =
      CodTrackerGG.get_user_matches!(
        username,
        platform,
        @pages_to_query,
        true
      )

    Common.process_to_insert(matches, user_id, username, platform, next_id)

    :ok
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(20)
end
