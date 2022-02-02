defmodule PlConnect.Workers.Match.Workflow.Notify do
  @moduledoc """
  Updates matches for a given user, it takes into account the last record in database
  """
  use Oban.Pro.Workers.Workflow, queue: :external

  require Ash.Query

  alias PlConnect.ApiClient.TourneysClient

  def process(%Oban.Job{args: %{"tourney_id" => tourney_id, "start_date" => start_date}}) do
    TourneysClient.notify_schedule_finished(tourney_id, start_date, Timex.now())

    :ok
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(20)
end
