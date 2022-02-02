defmodule PlConnect.Workers.Bet.ProcessIntercomMsgBet do
  @moduledoc """
  Ran ONLY when the bet start
  """
  use Oban.Worker,
    queue: :processor_intercom_msg_bet,
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
        args: %{"bet_id" => bet_id}
      }) do
    bet_history =
      UserBetHistory
      |> Ash.Query.filter(id == ^bet_id)
      |> Ash.Query.load([:owner, team: [:owner, teammates: [:user]]])
      |> PlConnect.Api.read_one!()

    if is_nil(bet_history) do
      :ok
    else
      ApiClient.new_bet_message(bet_history)
      :ok
    end
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(20)
end
