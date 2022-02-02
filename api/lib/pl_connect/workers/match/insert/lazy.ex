defmodule PlConnect.Workers.Match.Insert.Lazy do
  @moduledoc """
  Lazy update, low priority

  Ran ONLY when an user does not have any match info, this is more intensive since obtains more data at a faster rate than updating
  """
  use Oban.Worker,
    queue: :inserter,
    priority: 2,
    # do not repeat task when are running
    unique: [
      period: :infinity,
      fields: [:args, :worker],
      keys: [:user_id, :username, :platform, :next_id],
      states: [:available, :scheduled, :executing, :retryable]
    ]

  alias PlConnect.ApiClient.CodTrackerGG
  alias PlConnect.Workers.Match.Insert.Common

  # keep this low as possible, each request takes 700-2500 ms so it's very slow sometimes
  @pages_to_query 3

  @impl Oban.Worker
  def perform(%Oban.Job{
        args: %{
          "user_id" => user_id,
          "username" => username,
          "platform" => platform,
          "next_id" => next_id
        }
      }) do
    # get a wide range of matches
    {new_next_id, matches} =
      CodTrackerGG.process_next_pages(
        username,
        platform,
        @pages_to_query,
        next_id,
        []
      )

    if new_next_id == next_id do
      throw(
        "Cannot process the same id twice. user_id: #{user_id}, username: #{username}, platform: #{
          platform
        }, next_id: #{next_id}"
      )
    end

    Common.process_to_insert(matches, user_id, username, platform, new_next_id)

    :ok
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(20)
end
