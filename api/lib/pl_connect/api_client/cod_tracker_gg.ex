defmodule PlConnect.ApiClient.CodTrackerGG do
  @moduledoc """
  Api wrapper for the warzone api for tracker.gg
  """
  use Tesla

  plug Tesla.Middleware.BaseUrl, "https://api.tracker.gg/api/v2/warzone/standard"
  plug Tesla.Middleware.JSON
  plug PlConnect.ApiClient.Middleware.CacheMatches, ttl: :timer.minutes(40)
  plug Tesla.Middleware.Compression, format: "gzip"

  @valid_platforms ["psn", "xbl", "battlenet", :psn, :xbl, :battlenet]

  @doc """
  Retrive warzone profile information
  """
  def get_user_profile!(username, platform) when platform in @valid_platforms do
    username = encode_username(username)

    "/profile/#{platform}/#{username}"
    |> get!()
    |> get_response_data()
  end

  @doc """
  Get the latest matches by the given user
  """
  def get_user_last_matches!(username, platform) when platform in @valid_platforms do
    username = encode_username(username)

    "/matches/#{platform}/#{username}"
    |> get!(query: [type: "wz"])
    |> get_response_data()
  end

  @doc """
  Get the user paginated matches after the given next identifier
  """
  def get_user_next_matches!(username, platform, next)
      when platform in @valid_platforms and is_integer(next) do
    username = encode_username(username)

    "/matches/#{platform}/#{username}"
    |> get!(query: [type: "wz", next: next])
    |> get_response_data()
  end

  @doc """
  Search the given user, returns a list of users
  """
  def search_user(username, platform) do
    "/search"
    |> get!(query: [platform: platform, query: username])
    |> get_response_data()
  end

  def get_user_matches!(username, platform, pages_to_fetch, retrive_next \\ false)

  def get_user_matches!(username, platform, pages_to_fetch, retrive_next)
      when platform in @valid_platforms and pages_to_fetch > 1 do
    page_one = get_user_last_matches!(username, platform)
    page_one_matches = page_one["matches"]
    next_id = page_one["metadata"]["next"]

    {next, matches} =
      process_next_pages(username, platform, pages_to_fetch, next_id, page_one_matches)

    if retrive_next do
      {next, matches}
    else
      matches
    end
  end

  def get_user_matches!(_username, _platform, _pages_to_fetch, _retrive_next) do
    throw("something went wrong")
  end

  def process_next_pages(_, _, _, nil, nil), do: {nil, []}

  def process_next_pages(_, _, _, nil, page_one_matches) when is_list(page_one_matches),
    do: {nil, page_one_matches}

  def process_next_pages(username, platform, pages_to_fetch, next_id, page_one_matches)
      when is_list(page_one_matches) do
    Enum.reduce_while(1..pages_to_fetch, {next_id, page_one_matches}, fn _, {next_id, matches} ->
      response = get_user_next_matches!(username, platform, next_id)

      response_matches = response["matches"]
      response_next_id = response["metadata"]["next"]

      if response_matches == nil or response_next_id == nil do
        case response_matches do
          nil ->
            {:halt, {response_next_id, matches}}

          _ ->
            {:halt, {response_next_id, matches ++ response_matches}}
        end
      else
        {:cont, {response_next_id, matches ++ response_matches}}
      end
    end)
  end

  defp get_response_data(response) do
    response.body["data"]
  end

  defp encode_username(username), do: URI.encode(username) |> String.replace("#", "%23")
end
