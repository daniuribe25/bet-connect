defmodule PlConnect.Workers.DisbandOldTeams do
  @moduledoc """
  Runs once an hour, disbands teams older then 6 hours.
  """
  use Oban.Worker,
    queue: :default,
    priority: 0

  alias PlConnect.Api
  require Ash.Query

  @impl Oban.Worker
  def perform(_job) do
    six_hours_ago =
      Timex.now()
      |> Timex.shift(hours: -6)

    PlConnect.Cod.Team
    |> Ash.Query.filter(is_active == true and inserted_at < ^six_hours_ago)
    |> Api.read!()
    |> Enum.each(fn team -> Api.disband_team!(team) end)

    :ok
  end
end
