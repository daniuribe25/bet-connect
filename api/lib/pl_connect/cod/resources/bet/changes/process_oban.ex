defmodule PlConnect.Cod.Resource.Bet.Changes.ProcessOban do
  @moduledoc """
  Process Oban alerts
  """
  use Ash.Resource.Change
  require Ash.Query

  alias PlConnect.Api
  alias PlConnect.Workers.Analytics.TrackBetPlaced

  # 15minutes
  @schedule_after 900

  def process_oban do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn _changeset, record ->
      # queue processing
      %{bet_id: record.id, retry_count: 0}
      |> PlConnect.Workers.Bet.Process.new(schedule_in: @schedule_after)
      |> Oban.insert()

      # track bet placed segment event
      TrackBetPlaced.new(%{bet_id: record.id})
      |> Oban.insert()

      # Send First message for waiting´s bets:
      ## Rebirth: 25 minutes = 1500 seconds
      ## Verdansk: 40 minutes = 2400 seconds
      first_schedule =
        if record.map == :rebirth_island do
          1500
        else
          2400
        end

      %{bet_id: record.id, schedule_time: first_schedule, notice: "FIRST"}
      |> PlConnect.Workers.Bet.ProcessIntercomMsgs.new(schedule_in: first_schedule)
      |> Oban.insert()

      # Send Second message for waiting´s bets:
      ## Rebirth: 60 minutes = 3600 seconds
      ## Verdansk/Caldera: 75 minutes = 4500 seconds
      second_schedule =
        if record.map == :rebirth_island do
          3600 - first_schedule
        else
          4500 - first_schedule
        end

      %{bet_id: record.id, schedule_time: second_schedule, notice: "SECOND"}
      |> PlConnect.Workers.Bet.ProcessIntercomMsgs.new(schedule_in: second_schedule)
      |> Oban.insert()

      # # Send Third message for waiting´s bets:
      # ## 180 minutes = 10800 seconds
      # third_schedule = 10800 - second_schedule

      # %{bet_id: record.id, schedule_time: third_schedule, notice: "THIRD"}
      # |> PlConnect.Workers.Bet.ProcessIntercomMsgs.new(schedule_in: third_schedule)
      # |> Oban.insert()

      # # Send Fourth message for waiting´s bets:
      # ## 720 minutes = 43200 seconds
      # fourth_schedule = 43200 - third_schedule

      # %{bet_id: record.id, schedule_time: fourth_schedule, notice: "FOURTH"}
      # |> PlConnect.Workers.Bet.ProcessIntercomMsgs.new(schedule_in: fourth_schedule)
      # |> Oban.insert()

      # # Send message when the bet was launched
      # %{bet_id: record.id}
      # |> PlConnect.Workers.Bet.ProcessIntercomMsgBet.new(schedule_in: 1)
      # |> Oban.insert()

      PlConnectWeb.Endpoint.broadcast("team:#{record.team_id}", "new_bet", %{bet_id: record.id})

      team =
        PlConnect.Cod.Team
        |> Ash.Query.filter(id == ^record.team_id)
        |> Ash.Query.load([:owner, teammates: [:user]])
        |> PlConnect.Api.read_one!()

      balance = Enum.reduce(record.required_result, 0, &(&2 + &1.bet_amount))

      Enum.each(team.teammates, fn mate ->
        funds = mate.user.wallet.funds
        final_balance = funds - balance

        Api.update_user_wallet(mate.user, %{wallet: %{funds: final_balance}})

        Enum.reduce(record.required_result, funds, fn row, funds ->
          post_funds = funds - row.bet_amount
          Api.create_wallet_transaction(
            record.id,
            record.team_id,
            mate.user.id,
            %{
              bet_total_amount: row.bet_amount,
              prev_wallet_balance: funds,
              post_wallet_balance: post_funds,
              type: row.type,
              won: Map.get(row, :won, false),
              won_reward: row.rewarded_amount,
              status: :created
            }
          )
          post_funds
        end)
      end)

      {:ok, record}
    end)
  end
end
