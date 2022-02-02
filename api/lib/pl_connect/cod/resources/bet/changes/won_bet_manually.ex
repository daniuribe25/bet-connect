defmodule PlConnect.Cod.Resource.Bet.Changes.WonBetManually do
  @moduledoc """
  Ash change, admin change password
  """
  use Ash.Resource.Change

  @day_in_seconds 60 * 60 * 24

  alias Ash.Changeset
  alias PlConnect.Api
  alias PlConnect.Cod.Feature
  alias PlConnect.Cod.WalletTransaction
  alias PlConnect.Workers.Analytics.TrackBetResolved

  require Ash.Query

  def won_bet_manually do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      results = %{
        main: Changeset.get_argument(changeset, :won_main_bet),
        kills: Changeset.get_argument(changeset, :won_kills_bet),
        placement: Changeset.get_argument(changeset, :won_placement_bet),
        match: Changeset.get_argument(changeset, :won_match_bet),
        damage: Changeset.get_argument(changeset, :won_damage_bet)
      }

      bet_history_id = Changeset.get_attribute(changeset, :id)
      t_id = Changeset.get_attribute(changeset, :team_id)

      team =
        PlConnect.Cod.Team
        |> Ash.Query.filter(id == ^t_id)
        |> Ash.Query.load(teammates: [:user])
        |> PlConnect.Api.read_one!()

      process_results(results, team)
      changeset = process_history_results(results, changeset)

      balance = process_balance(changeset, results)

      required_result = Changeset.get_attribute(changeset, :required_result)

      Enum.reduce(team.teammates, [], fn teammate, acc ->
        funds = teammate.user.wallet.funds
        final_balance = funds + balance
        user = teammate.user

        difficulty = Enum.reduce(results, user.difficulty, fn {line, won}, difficulty ->
          current_line = Map.get(difficulty, line)
          default = current_line["factor"]
          {math_func, key} = if won, do: {&Kernel.+/2, "factor"}, else: {&Kernel.-/2, "reduce"}
          value = math_func.(current_line["value"], Map.get(current_line, key, default))
                  |> (&(if &1 < 0, do: 0, else: &1)).()

          Map.put(current_line, "value", value)
          |> (&Map.put(difficulty, line, &1)).()
        end)

        user = Api.update_user_process_data!(user, %{difficulty: difficulty, wallet: %{funds: final_balance}})

        {transactions, _} = Enum.reduce(required_result, {[], funds}, fn row, {transactions, funds} ->
          {math_func, amount} = if Map.get(row, :won, false),
            do: {&Kernel.+/2, row.bet_amount + row.rewarded_amount},
            else: {&Kernel.-/2, 0}
          post_funds = math_func.(funds, amount)

          data = %{
            type: row.type,
            status: :complete,
            prev_wallet_balance: funds,
            won: Map.get(row, :won, false),
            won_reward: row.rewarded_amount,
            post_wallet_balance: post_funds,
            bet_total_amount: row.bet_amount
          }
          transaction = create_changeset(:create, WalletTransaction, data)
            |> Map.put(:id, UUID.uuid4())
            |> Map.put(:user_id, user.id)
            |> Map.put(:team_id, team.id)
            |> Map.put(:bet_history_id, bet_history_id)
          {transactions ++ [transaction], post_funds}
        end)

        acc ++ transactions
      end)

      PlConnectWeb.Endpoint.broadcast("user:#{team.owner_id}", "bet_lines", %{team_id: team.id})

      notify_balance = Feature.get_feature_flag(:notify_balance)
      date = Changeset.get_attribute(changeset, :inserted_at)
      start_range = DateTime.add(date, -@day_in_seconds, :second)

      # track bet resolved segment event
      TrackBetResolved.new(%{bet_id: bet_history_id, resolution_method: "admin"})
      |> Oban.insert()

      {:ok, bets} =
        PlConnect.Cod.UserBetHistory
        |> Ash.Query.filter(team_id == ^team.id and inserted_at >= ^start_range and inserted_at <= ^date)
        |> Ash.Query.sort(inserted_at: :asc)
        |> Api.read()

      won_balance_24_hours = Enum.reduce(bets, 0, fn bet, total ->
        Enum.reduce(bet.required_result, 0, fn res, t ->
          if res.won, do: res.rewarded_amount + res.bet_amount + t, else: t
        end)
        |> (&(&1 + total)).()
      end)
      if won_balance_24_hours > notify_balance do
        PlConnect.Intercom.ApiClient.team_won_to_much_money(team)
      end

      Changeset.force_change_attribute(changeset, :status, :complete)
    end)
  end

  defp process_history_results(results, changeset) do
    bets = Changeset.get_attribute(changeset, :required_result)

    required_result =
      Enum.map(bets, fn x ->
        Map.put(x, :won, Map.get(results, x.type, false) || false)
      end)

    Changeset.force_change_attribute(changeset, :required_result, required_result)
  end

  # levelup if won
  defp process_results(results, team) do
    levels = Enum.reduce(results, %{}, fn data, acc ->
      case data do
        {:main, true} -> Map.put(acc, :main_bet_level, team.main_bet_level + 1)
        {:damage, true} -> Map.put(acc, :main_bet_level, team.damage_bet_level + 1)
        {:placement, true} -> Map.put(acc, :main_bet_level, team.placement_bet_level + 1)
        _ -> acc
      end
    end)

    Api.set_team_levels!(team, levels)
  end

  defp process_balance(changeset, results) do
    bets = Changeset.get_attribute(changeset, :required_result)

    Enum.reduce(bets, 0, fn x, balance ->
      bet_amount = x.bet_amount
      rewarded_amount = x.rewarded_amount

      new_balance =
        calculate_balance(Map.get(results, x.type, false), rewarded_amount, bet_amount)

      balance + new_balance
    end)
  end

  defp calculate_balance(won, reward, bet_amount) do
    if won do
      reward + bet_amount
    else
      0
    end
  end

  defp create_changeset(action, module, data) do
    action = case action do
      :create -> :for_create
      :update -> :for_update
      _ -> :for_update
    end

    apply(Ash.Changeset, action, [Ash.Changeset.new(module), action, data])
    |> Map.get(:attributes)
  end
end
