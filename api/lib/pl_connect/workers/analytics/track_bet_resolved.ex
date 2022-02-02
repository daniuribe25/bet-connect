defmodule PlConnect.Workers.Analytics.TrackBetResolved do
  @moduledoc """
  Tracks Segment event when bet is resolved
  """
  use Oban.Worker,
      queue: :analytics,
      priority: 0

  alias PlConnect.Api
  alias PlConnect.Segment
  require Ash.Query

  @impl Oban.Worker
  def perform(%Oban.Job{ args: %{"bet_id" => bet_id, "resolution_method" => resolution_method} }) do
    user_bet_history = Api.get_bet_history!(bet_id)

    team_id = user_bet_history.team_id
    bet_history_id = user_bet_history.id
    results = user_bet_history.required_result
    stats = user_bet_history.stats
    team =
      PlConnect.Cod.Team
      |> Ash.Query.filter(id == ^team_id)
      |> Ash.Query.load(teammates: [user: [:matches]])
      |> PlConnect.Api.read_one!()

    mode = case team.squad_size do
      4 -> "quads"
      3 -> "trios"
      2 -> "duos"
      1 -> "solo"
    end

    main_bet_format = case user_bet_history.bet_format do
      :rookie -> "$3"
      :legend -> "$5"
      :diamond -> "$10"
    end

    {
      amount_bet,
      possible_payout,
      payout_without_stake,
      payout_with_stake,
      revenue
    } = Enum.reduce(results, {0, 0, 0, 0, 0}, fn row,
      {amount_bet, possible_payout, payout_without_stake, payout_with_stake, revenue} ->
      won = Map.get(row, :won, false)
      with_stake = (if won, do: row.rewarded_amount + row.bet_amount, else: 0)
      {
        amount_bet + row.bet_amount,
        possible_payout + row.rewarded_amount,
        payout_without_stake + (if won, do: row.rewarded_amount, else: 0),
        payout_with_stake + with_stake,
        revenue + (row.bet_amount - with_stake)
      }
    end)

    { total_lines, lines } = Enum.reduce(results,
      {%{}, []},
      fn %{type: type, value: value, rewarded_amount: rewarded_amount, won: won}, {acc, lines} ->
      bet_levels = Enum.find(user_bet_history.user_bets_level_result, fn ublr -> ublr.type == type end)

      stats_type = if Atom.to_string(type) === "main", do: "kills", else: Atom.to_string(type)
      stats_type = if stats_type === "match", do: "placement", else: stats_type

      score = if !is_nil(stats), do: Map.get(stats, String.to_atom(stats_type)), else: 0
      score_diff = if !is_nil(stats), do: Map.get(stats, String.to_atom(stats_type)) - value, else: 0

      new_acc = acc
        |> Map.put(String.to_atom("#{type}_line_taken"), value)
        |> Map.put(String.to_atom("#{type}_line_difficulty_taken"), bet_levels.level)
        |> Map.put(String.to_atom("#{type}_line_actual_payout"), (if won, do: rewarded_amount, else: 0))
        |> Map.put(String.to_atom("#{type}_line_possible_payout"), rewarded_amount)
        |> Map.put(String.to_atom("#{type}_line_score"), score)
        |> Map.put(String.to_atom("#{type}_line_score_diff"), score_diff)
        |> Map.put(String.to_atom("#{type}_line_bet_won"), won)

      {new_acc, lines ++ [type]}
    end)

    team_size = length(team.teammates)

    {
      total_amount_bet,
      total_possible_payout,
      total_payout_without_stake,
      total_payout_with_stake,
      total_revenue
    } = Enum.reduce(team.teammates, {0, 0, 0, 0, 0}, fn team_user,
      {total_amount_bet, total_possible_payout, total_payout_without_stake, total_payout_with_stake, total_revenue} ->
      balance_before = team_user.user.wallet.funds - payout_without_stake

      # new deposit
      extra_info = case Api.get_report_event_value(team_user.user_id, bet_id, "bet_placed") do
          {:ok, %{additional_info: additional_info} = last_report} ->
            {won_amount, lost_amount} = if payout_without_stake == 0, do: {0, payout_without_stake}, else: {payout_without_stake, 0}
            %{
              user_id: team_user.user_id,
              event_name: "bet_placed",
              value: bet_id,
              additional_info: %{
                bets_count: additional_info["bets_count"],
                bets_count_lost: additional_info["bets_count_lost"] + (if lost_amount == 0, do: 0, else: 0),
                bets_count_won: additional_info["bets_count_won"] + (if won_amount == 0, do: 0, else: 0),
                bets_amount_total: additional_info["bets_amount_total"],
                bets_amount_won: additional_info["bets_amount_won"] + won_amount,
                bets_amount_lost: additional_info["bets_amount_lost"] + lost_amount,
                bets_total: additional_info["bets_total"]
              }
            }
            |> (&Api.update_report_event!(last_report, &1)).()
            |> Map.get(:additional_info)
          _ -> %{message: "error getting the last report"}
        end

      Segment.identify(team_user.user, extra_info)
      Segment.track("bet resolved (user)", team_user.user_id, %{
        bet_id: bet_history_id,
        team_id: team.id,
        # Balance
        balance_before: balance_before,
        balance_after: team_user.user.wallet.funds,
        # Game info
        team_size: team_size,
        in_game_squad_size: team.squad_size,
        enough_data_to_generate_lines: team.use_generated,
        map: user_bet_history.map,
        mode: mode,
        main_bet_format: main_bet_format,
        lines_taken: lines,
        lines: total_lines,
        win_bet_taken: Enum.member?(lines, :match),
        total_amount_bet: amount_bet,
        total_possible_payout: possible_payout,
        total_payout_with_stake: payout_with_stake,
        total_payout_without_stake: payout_without_stake,
        resolution_method: resolution_method,
        revenue: revenue,
        revenueType: "income"
      })
      {
        total_amount_bet + amount_bet,
        total_possible_payout + possible_payout,
        total_payout_without_stake + payout_without_stake,
        total_payout_with_stake + payout_with_stake,
        total_revenue + revenue
      }
    end)

    Segment.track("bet resolved (team)", team.id, %{
      bet_id: bet_history_id,
      team_id: team.id,
      # Game info
      team_size: team_size,
      map: user_bet_history.map,
      mode: mode,
      in_game_squad_size: team.squad_size,
      enough_data_to_generate_lines: team.use_generated,
      # Specific line info
      lines: total_lines,
      # High level info
      main_bet_format: main_bet_format,
      lines_taken: lines,
      total_amount_bet: total_amount_bet,
      total_possible_payout: total_possible_payout,
      total_payout_without_stake: total_payout_without_stake,
      total_payout_with_stake: total_payout_with_stake,
      total_revenue: total_revenue
    })

    :ok
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(30)

end
