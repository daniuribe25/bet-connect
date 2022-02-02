defmodule PlConnect.Workers.Bet.ProcessIntercomMsgs do
  @moduledoc """
  Ran ONLY when an bet still in pending
  """
  use Oban.Worker,
    queue: :processor_intercom_msgs,
    priority: 0

  alias PlConnect.Intercom.ApiClient
  alias PlConnect.Cod.UserBetHistory

  require Ash.Query

  @impl Oban.Worker
  def perform(%Oban.Job{
        args: %{"team_id" => _team_id}
      }),
      # do not process old versions of the processing task
      do: :ok

  def perform(%Oban.Job{
        args: %{"bet_id" => bet_id, "schedule_time" => schedule_time, "notice" => notice}
      }) do
    bet_history =
      UserBetHistory
      |> Ash.Query.filter(id == ^bet_id and status == :waiting)
      |> Ash.Query.load([:owner, team: [:owner, teammates: [:user]]])
      |> PlConnect.Api.read_one!()

    if is_nil(bet_history) do
      :ok
    else
      ApiClient.msg_bet_is_waiting(bet_history, schedule_time, notice)
      :ok
    end
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(20)
end
