defmodule PlConnect.ApiClient.V1CodTrackerGG do
  @moduledoc """
  Api wrapper for the warzone api for tracker.gg
  """
  use Tesla

  plug Tesla.Middleware.BaseUrl, "https://api.tracker.gg/api/v1/warzone/standard"
  plug Tesla.Middleware.JSON

  @doc """
  Retrive leaderboards data
  """
  def get_leaderboards(platform \\ "all", limit \\ 100) do
    "leaderboards?type=stats&platform=#{platform}&board=Wins&skip=0&take=#{limit}"
    |> get!()
    |> get_response_data()
  end

  defp get_response_data(response) do
    response.body["data"]
  end
end
