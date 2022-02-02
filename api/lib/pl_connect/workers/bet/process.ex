defmodule PlConnect.Workers.Bet.Process do
  @moduledoc """
  Ran ONLY when an user does not have any match info, this is more intensive since obtains more data at a faster rate than updating
  """
  use Oban.Worker,
    queue: :bet_processor,
    priority: 0,
    # do not repeat task when are running
    unique: [
      period: :infinity,
      fields: [:args, :worker],
      keys: [:bet_id, :retry_count],
      states: [:available, :scheduled, :executing, :retryable]
    ]

  alias PlConnect.Api
  alias PlConnect.Cod.UserBetHistory
  alias PlConnect.Cod.WalletTransaction
  alias PlConnect.Intercom.ApiClient
  alias PlConnect.Workers.Match
  alias PlConnect.Cod.PlayerMatch
  alias PlConnect.Intercom.ApiClient
  alias PlConnect.Cod.Feature
  alias PlConnect.Workers.Analytics.TrackBetResolved

  require Ash.Query

  # MV: do every 2 minutes (initial is queued 15minutes into game);
  @schedule_after 120
  # MV: Poll until we're ~80min after the game. Then assume dead.
  @max_retries 40
  # MV: Todo: We should have some kind of refund logic.
  @day_in_seconds 60 * 60 * 24

  @impl Oban.Worker

  def perform(%Oban.Job{
        args: %{"bet_id" => bet_id, "retry_count" => retry_count}
      }) do
    bet_history = Api.get_bet_history!(bet_id)

    timeout = Feature.get_feature_flag(:refund_timeout)
    end_range = DateTime.add(bet_history.inserted_at, timeout.value * 60, :second)
    time_passed = DateTime.diff(bet_history.inserted_at, end_range)
    if time_passed > 0 do
      {:ok, Api.refund_bet!(bet_history)}
      PlConnect.Workers.Analytics.TrackRefund.new(%{bet_id: bet_history.id})
      |> Oban.insert()
    else
      process(bet_history, retry_count)
    end

  end

  defp process(%{status: :complete}, _retry_count) do
    # do not process bet if its already completed
  end

  defp process(%{status: :refunded}, _retry_count) do
    # do not process bet if its already refunded
  end

  defp process(bet_history, retry_count) do
    bet_history =
      if retry_count == 0 do
        Api.user_bet_history_push_event!(bet_history, %{event: :search_started})
      else
        bet_history
      end

    team = bet_history.team

    teammates = (Enum.map(team.teammates, & &1.user) ++ [team.owner])

    Enum.each(teammates, fn user ->
      # enqueue each member to check api history
      platforms = PlConnect.Helpers.get_user_platforms(user)

      # nb: we only need to check their first platform from cod
      %{user_id: user.id, platform: List.first(platforms)}
      |> Match.Update.new()
      |> Oban.insert()
    end)

    # - compare the results of this match to win or lose
    result = bet_history.required_result

    {result, bet_history} =
      with {:ok, match} when match != nil <- find_bet_match(bet_history),
          teammates_stats when teammates_stats != [] <- get_teammates_stats(match, team.teammates) do
        {kills, damage, placement} =
          Enum.reduce(teammates_stats, {0, 0, 200}, fn mate_stats, {kills, damage, placement} ->
            {
              kills + mate_stats.kills,
              damage + mate_stats.damage,
              min(placement, mate_stats.placement)
            }
          end)

        {results, balance} = process_results(result, kills, damage, placement)

        process_results(results, team)

        bet_history =
          process_history_results(results, bet_history, match, %{kills: kills, damage: damage, placement: placement})

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

          {transactions, _} = Enum.reduce(bet_history.required_result, {[], funds}, fn row, {transactions, funds} ->
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
              |> Map.put(:bet_history_id, bet_history.id)
            {transactions ++ [transaction], post_funds}
          end)

          acc ++ transactions
        end)
        |> (&Ecto.Multi.insert_all(Ecto.Multi.new(), :insert_transactions, WalletTransaction, &1, on_conflict: :nothing)).()
        |> PlConnect.Repo.transaction()

        bet_history = Api.set_user_bet_complete!(bet_history)

        PlConnectWeb.Endpoint.broadcast("user:#{team.owner_id}", "bet_lines", %{team_id: team.id})

        notify_balance = Feature.get_feature_flag(:notify_balance)
        start_range = DateTime.add(bet_history.inserted_at, -@day_in_seconds, :second)

        {:ok, bets} =
          UserBetHistory
          |> Ash.Query.filter(team_id == ^team.id and inserted_at >= ^start_range and inserted_at <= ^bet_history.inserted_at)
          |> Ash.Query.sort(inserted_at: :asc)
          |> Api.read()

        {won_balance_24_hours, loss_balance_24_hours} = Enum.reduce(bets, {0, 0}, fn bet, {won, loss} ->
          {w, l} = Enum.reduce(bet.required_result, {0, 0}, fn res, {w, l} ->
            if res.won, do: {w + res.rewarded_amount, l}, else: {w, l + res.bet_amount}
          end)
          {won + w, loss + l}
        end)
        if won_balance_24_hours - loss_balance_24_hours > notify_balance do
          ApiClient.team_won_to_much_money(team)
        end

        # track bet resolved segment event
        TrackBetResolved.new(%{bet_id: bet_history.id, resolution_method: "auto"})
        |> Oban.insert()

        {:ok, Api.get_bet_history!(bet_history.id)}
      else
        _ ->
          {:error, bet_history}
      end

    bet_history =
      if result == :error do
        if retry_count <= @max_retries do
          %{bet_id: bet_history.id, retry_count: retry_count + 1}
          |> new(
            unique: [
              period: :infinity,
              fields: [:args, :worker],
              keys: [:bet_id, :retry_count],
              states: [:available, :scheduled, :retryable]
            ],
            schedule_in: @schedule_after
          )
          |> Oban.insert()
        else
          ApiClient.warning_admin_match(bet_history)
        end

        bet_history
      else
        Api.user_bet_history_push_event!(bet_history, %{event: :search_ended})
      end

    {:ok, bet_history}
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(30)

  defp create_changeset(action, module, data) do
    action = case action do
      :create -> :for_create
      :update -> :for_update
      _ -> :for_update
    end

    apply(Ash.Changeset, action, [Ash.Changeset.new(module), action, data])
    |> Map.get(:attributes)
  end

  defp process_history_results(results, bet, api_match, stats) do
    records = bet.required_result

    required_results =
      Enum.map(records, fn x ->
        Map.put(x, :won, Map.get(results, x.type, false) || false)
      end)

    match_id = String.to_integer(api_match.json_response["attributes"]["id"])

    Api.update_user_bet_result!(bet, match_id, required_results, stats)
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

  def process_results(results, kills, damage, placement) do
    Enum.reduce(results, {%{}, 0}, fn bet, {y, balance} ->
      requirement = bet.value
      bet_amount = bet.bet_amount
      rewarded_amount = bet.rewarded_amount

      # add levels to the thing
      {won, new_balance} =
        case bet.type do
          :main -> calculate_balance(&Kernel.<=/2, requirement, kills, rewarded_amount, bet_amount)
          :kills -> calculate_balance(&Kernel.<=/2, requirement, kills, rewarded_amount, bet_amount)
          :placement -> calculate_balance(&Kernel.>=/2, requirement, placement, rewarded_amount, bet_amount)
          :match -> calculate_balance(&Kernel.==/2, 1, placement, rewarded_amount, bet_amount)
          :damage -> calculate_balance(&Kernel.<=/2, requirement, damage, rewarded_amount, bet_amount)
        end

      {Map.put(y, bet.type, won), balance + new_balance}
    end)
  end

  defp calculate_balance(comparison_func, requirement, value, reward, bet) do
    if comparison_func.(requirement, value) do
      {true, reward + bet}
    else
      {false, 0}
    end
  end

  def get_teammates_stats(match, teammates) do
    # TODO query the match itself for these data to be accurate...

    teammates = Enum.map(teammates, & &1.user_id)

    match_cod_id = match.match_cod_id

    matches =
      PlayerMatch
      |> Ash.Query.filter(match_cod_id == ^match_cod_id)
      |> PlConnect.Api.read!()
      |> Enum.uniq_by(&[&1.user_id, &1.match_cod_id])

    match_with_teammates =
      Enum.map(teammates, fn mate_id ->
        if Enum.find(matches, &(&1.user_id == mate_id)), do: mate_id, else: nil
      end)
      |> Enum.all?(&(!is_nil(&1)))

    if match_with_teammates do
      Enum.map(matches, fn match ->
        overview = Enum.at(match.json_response["segments"], 0)
        metadata = overview["metadata"]
        stats = overview["stats"]

        placement =
          if is_nil(match.placement) do
            99
          else
            match.placement
          end

        %{
          kills: match.kills,
          damage: match.damage,
          placement: placement,
          username: metadata["platformUserHandle"],
          deaths: stats["deaths"]["value"]
        }
      end)
    else
      []
    end
  end

  def find_bet_match(%UserBetHistory{
        team: %{squad_size: squad_size, owner: %{id: owner_id}} = team,
        inserted_at: match_date,
        map: map
      }) do
    teamcomp = case squad_size do
      4 -> :quads
      3 -> :trios
      2 -> :duos
      _ -> :unknown
    end

    match_type = case map do
      map when map in [:verdansk, :caldera] -> :br
      :rebirth_island -> :resurgence
      _ -> :unknown
    end

    # 15 minutes to start game
    end_range = DateTime.add(match_date, 900, :second)

    {:ok, matches} =
      PlConnect.Cod.PlayerMatch
      |> Ash.Query.filter(
        user_id == ^owner_id and match_map == ^map and match_date >= ^match_date and
          match_date <= ^end_range and match_teamcomp == ^teamcomp and match_type == ^match_type
      )
      # MV: Get closest to start of bet
      |> Ash.Query.sort(match_date: :asc)
      |> Api.read()

    {:ok, Enum.at(matches, 0)}
  end
end
