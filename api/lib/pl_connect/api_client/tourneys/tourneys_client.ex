defmodule PlConnect.ApiClient.TourneysClient do
  @moduledoc """
  Api wrapper for the warzone api for tracker.gg
  """
  use Tesla

  plug Tesla.Middleware.JSON
  plug Tesla.Middleware.Headers, [{"accept", "application/json"}]
  plug Tesla.Middleware.BaseUrl, Application.get_env(:pl_connect, :tournaments_url)

  @doc """
  Retrive all tournamets active
  """
  def active_tournaments() do
    "/tournament/all-active"
    |> get!()
    |> get_response_data()
  end

  @doc """
  Retrive all tournamets active and provide user ID
  """
  def active_tournaments(userId) do
    "/tournament/all-active?userId=#{userId}"
    |> get!()
    |> get_response_data()
  end

  @doc """
  Retrive a tournament by id
  """
  def get_tournament_by_id(tournament_id), do: get_tournament_by_id_request(tournament_id, "")

  @doc """
  Retrive a tournament by id and pass user id
  """
  def get_tournament_by_id(tournament_id, userId), do: get_tournament_by_id_request(tournament_id, "&userId=#{userId}")

  defp get_tournament_by_id_request(tournament_id, extra) do
    "/tournament/by-id?tournamentId=#{tournament_id}#{extra}"
    |> get!()
    |> get_response_data()
  end

  def get_tournaments_by_user(userId) do
    "/tournament/by-user?userId=#{userId}"
    |> get!()
    |> get_response_data()
  end

  @doc """
  Add the selected team to selected tournament

  """
  def join_tournament(data) do
    "/user/join-tournament"
    |> post!(data)
    |> get_response_data()
  end

  @doc """
  leaves the selected team to selected tournament
  """
  def leave_tournament(tournament_id, team_id) do
    "/user/leave-tournament"
    |> post!(%{
      "tournamentId" => tournament_id,
      "team" => %{
        "teamId" => team_id
      }
    })
    |> get_response_data()
  end

  @doc """
  notifies to the endpoint that the schedule ends his process
  """
  def notify_schedule_finished(tournament_id, start_date, end_date) do
    start_date = Timex.format(start_date, "{ISO:Extended}")
    end_date = Timex.format(end_date, "{ISO:Extended}")

    "/tournament/match-history/notify"
    |> post!(%{
      "tournamentId" => tournament_id,
      "tasksStartedDateTime" => start_date,
      "completedDateTime" => end_date
    })

    :ok
  end

  defp get_response_data(%{status: status, body: body}) when status >= 200 and status <= 299, do: body
  defp get_response_data(%{status: status, body: body}) when status >= 400, do: {status, body}

end
