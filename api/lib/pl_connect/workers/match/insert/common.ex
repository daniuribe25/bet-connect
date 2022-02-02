defmodule PlConnect.Workers.Match.Insert.Common do
  @moduledoc """
  Common code for Insert match worker operations
  """

  alias PlConnect.ApiClient.Utils
  alias PlConnect.Cod.PlayerMatch
  alias PlConnect.Repo
  alias PlConnect.Workers

  @max_matches 200

  @doc """
  Takes the last record from the database and update the record going forward
  """
  def process_to_insert(matches, user_id, username, platform, _) when matches in [nil, []] do
    # no matches, try later, maybe rate limited
    Workers.schedule_queue_insert_matches(user_id, username, platform, [:available, :scheduled])
  end

  def process_to_insert(matches, user_id, username, platform, next_id) do
    # add them to the database
    records =
      matches
      |> Utils.response_to_insert_record(user_id, username, platform)
      |> Utils.create_user_match_attrs(user_id)

    Ecto.Multi.new()
    |> Ecto.Multi.insert_all(:insert_matches, PlayerMatch, records, on_conflict: :nothing)
    |> Repo.transaction()

    # make sure we don't add way too much info
    %{matches_count: matches_count} = Utils.get_user_matches_count!(user_id)

    # no more data available or way too many query matches, send update message
    if next_id == nil || matches_count >= @max_matches do
      Workers.queue_update_matches(user_id, platform)
    else
      # send the rest to the lazy queue which will continue inserting new records
      Workers.queue_lazy_insert_matches(user_id, username, platform, next_id)
    end
  end
end
