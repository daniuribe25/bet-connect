defmodule PlConnect.Cod.Resource.Bet.Changes.BetRefunded do
  @moduledoc """
  Refund the money to each player
  """
  use Ash.Resource.Change
  require Ash.Query

  alias PlConnect.Api

  def bet_refunded do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      adjust_users_balance(changeset)
      changeset
    end)
  end

  defp adjust_users_balance(changeset) do
    bet_history_id = changeset.data.id
    results = changeset.data.required_result
    team_id = changeset.data.team_id
    balance = Enum.reduce(results, 0, &(&2 + &1.bet_amount))

    team =
      PlConnect.Cod.Team
      |> Ash.Query.filter(id == ^team_id)
      |> Ash.Query.load(teammates: [user: [:matches]])
      |> PlConnect.Api.read_one!()

    Enum.each(team.teammates, fn teammate ->
      funds = teammate.user.wallet.funds

      final_balance = funds + balance
      Api.update_user_wallet(teammate.user, %{wallet: %{funds: final_balance}})

      Enum.each(results, fn row ->
        Api.create_wallet_transaction(
          bet_history_id,
          team_id,
          teammate.user.id,
          %{
            bet_total_amount: row.bet_amount,
            prev_wallet_balance: funds,
            post_wallet_balance: final_balance,
            type: row.type,
            won: Map.get(row, :won, false),
            won_reward: row.rewarded_amount,
            status: :refunded
          }
        )
      end)
    end)
  end
end
