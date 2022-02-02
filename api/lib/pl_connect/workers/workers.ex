defmodule PlConnect.Workers do
  @moduledoc """
  Api for all worker operations
  """
  # 1 hour in seconds
  # todo: we should move this instead fo be on a schedule or smoething.
  @update_after 3600

  # seconds delay from a task to another
  @global_delay 5

  @unique_states [:available, :scheduled, :executing, :retryable]

  def queue_insert_matches(user_id, username, platform, wzranked_uno) do
    %{user_id: user_id, username: username, platform: platform}
    |> PlConnect.Workers.Match.Insert.new(schedule_in: @global_delay)
    |> Oban.insert!()

    if !is_nil(wzranked_uno) do
      %{user_id: user_id, wzranked_uno: wzranked_uno, platform: platform}
      |> PlConnect.Workers.Profile.Wzranked.new(schedule_in: @global_delay)
      |> Oban.insert!()
    end
  end

  def schedule_queue_insert_matches(user_id, username, platform, unique_states \\ @unique_states) do
    %{user_id: user_id, username: username, platform: platform}
    |> PlConnect.Workers.Match.Insert.new(
      schedule_in: @update_after,
      unique: [
        period: :infinity,
        fields: [:args, :worker],
        keys: [:user_id, :username, :platform],
        states: unique_states
      ]
    )
    |> Oban.insert!()
  end

  def queue_lazy_insert_matches(user_id, username, platform, next_id) do
    %{user_id: user_id, platform: platform, username: username, next_id: next_id}
    |> PlConnect.Workers.Match.Insert.Lazy.new(schedule_in: @global_delay)
    |> Oban.insert()
  end

  def queue_update_matches(user_id, platform, unique_states \\ @unique_states) do
    %{user_id: user_id, platform: platform}
    |> PlConnect.Workers.Match.Update.new(
      schedule_in: @update_after,
      unique: [
        period: :infinity,
        fields: [:args, :worker],
        keys: [:platform, :user_id],
        states: unique_states
      ]
    )
    |> Oban.insert()
  end

  def queue_update_lazy_matches(user_id, platform, next_id, last_match_id, counter \\ 1) do
    %{
      user_id: user_id,
      platform: platform,
      next_id: next_id,
      last_match_id: last_match_id,
      counter: counter
    }
    |> PlConnect.Workers.Match.Update.Lazy.new(schedule_in: @global_delay)
    |> Oban.insert()
  end

  def schedule_queue_update_lazy_matches(
        user_id,
        platform,
        next_id,
        last_match_id,
        counter \\ 1,
        unique_states \\ @unique_states
      ) do
    %{
      user_id: user_id,
      platform: platform,
      next_id: next_id,
      last_match_id: last_match_id,
      counter: counter
    }
    |> PlConnect.Workers.Match.Update.Lazy.new(
      schedule_in: @update_after,
      unique: [
        period: :infinity,
        fields: [:args, :worker],
        keys: [:user_id, :platform, :next_id, :last_match_id],
        states: unique_states
      ]
    )
    |> Oban.insert()
  end

  def queue_upsert_profile(user_id, username, platform, wzranked_uno) do
    %{user_id: user_id, username: username, platform: platform}
    |> PlConnect.Workers.Profile.Upsert.new(schedule_in: @global_delay)
    |> Oban.insert!()

    if !is_nil(wzranked_uno) do
      %{user_id: user_id, wzranked_uno: wzranked_uno, platform: platform}
      |> PlConnect.Workers.Profile.Wzranked.new(schedule_in: @global_delay)
      |> Oban.insert!()
    end
  end
end
