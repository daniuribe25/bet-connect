defmodule PlConnect.Workers.Match.Update.Common do
  @moduledoc """
  Common code for Update match worker operations
  """

  alias PlConnect.ApiClient.Utils
  alias PlConnect.Cod.PlayerMatch
  alias PlConnect.Repo
  alias PlConnect.Workers

  @doc """
  Takes the last record from the database and update the record going forward
  """
  def process_to_update(
        player_match,
        matches_response,
        username,
        platform,
        user_id,
        last_match_id,
        last_id,
        counter \\ 0
      ) do
    case process_existing_match(player_match.match_cod_id, matches_response) do
      {:ok, matches} ->
        # normalize and add to database
        insert_matches(matches, player_match, username, platform)

        # once added send an update for later on
        Workers.queue_update_matches(user_id, platform, [:available, :scheduled])

      {:update, nil, matches} ->
        # normalize data and add to db
        insert_matches(matches, player_match, username, platform)

        # no next_id so we just update for later on
        Workers.queue_update_matches(user_id, platform, [:available, :scheduled])

      {:update, next_id, matches} ->
        # normalize data and add to db
        insert_matches(matches, player_match, username, platform)

        # we don't have it updated yet so we must continue looking for it
        Workers.queue_update_lazy_matches(user_id, platform, next_id, last_match_id, counter + 1)

      :retry ->
        # response is nil so probably got rate limited, retry later
        if last_id == nil do
          # no previous id, just update
          Workers.queue_update_matches(user_id, platform, [:available, :scheduled])
        else
          Workers.schedule_queue_update_lazy_matches(
            user_id,
            platform,
            last_id,
            last_match_id,
            [
              :available,
              :scheduled
            ],
            counter
          )
        end
    end
  end

  def process_to_update_no_schedule(
        player_match,
        matches_response,
        username,
        platform
      ) do
    case process_existing_match(player_match.match_cod_id, matches_response) do
      {:ok, matches} ->
        # normalize and add to database
        insert_matches(matches, player_match, username, platform)

      {:update, nil, matches} ->
        # normalize data and add to db
        insert_matches(matches, player_match, username, platform)

      {:update, _next_id, matches} ->
        # normalize data and add to db
        insert_matches(matches, player_match, username, platform)

      :retry ->
        :ok
    end
  end

  defp insert_matches(matches, player_match, username, platform) do
    records =
      matches
      |> Utils.response_to_insert_record(player_match.user.id, username, platform)
      |> Utils.create_user_match_attrs(player_match.user.id)

    Ecto.Multi.new()
    |> Ecto.Multi.insert_all(:insert_matches, PlayerMatch, records, on_conflict: :nothing)
    |> Repo.transaction()
  end

  defp process_existing_match(_, nil), do: :retry

  defp process_existing_match(last_match_id, response) do
    # sort the matches by their date played so we don't add repeated data

    matches =
      response["matches"]
      |> Enum.map(fn x ->
        metadata = x["metadata"]

        new_metadata = %{
          metadata
          | "timestamp" => NaiveDateTime.from_iso8601!(metadata["timestamp"])
        }

        %{x | "metadata" => new_metadata}
      end)
      |> Enum.sort_by(& &1["metadata"]["timestamp"], {:desc, NaiveDateTime})

    next_id = response["metadata"]["next"]

    matches_ids =
      Enum.map(matches, fn record ->
        record["attributes"]["id"] |> String.to_integer()
      end)

    do_record_exist = Enum.member?(matches_ids, last_match_id)

    # if exist then reduce_while for the records to insert
    if do_record_exist do
      matches =
        Enum.reduce_while(matches, [], fn x, acc ->
          match_id = x["attributes"]["id"] |> String.to_integer()

          if last_match_id == match_id do
            {:halt, acc}
          else
            {:cont, [x | acc]}
          end
        end)

      {:ok, matches}
    else
      # if does not add all records and send an update for the remaining record
      {:update, next_id, matches}
    end
  end
end
