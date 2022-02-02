defmodule PlConnect.Workers.Analytics.TrackBetPlaced do
  @moduledoc """
  Tracks Segment event when bet is placed
  """
  use Oban.Worker,
      queue: :analytics,
      priority: 0

  alias PlConnect.Api
  alias PlConnect.Segment
  require Ash.Query

  @impl Oban.Worker
  def perform(%Oban.Job{ args: %{"bet_id" => bet_id} }) do
    user_bet_history = Api.get_bet_history!(bet_id)

    team_id = user_bet_history.team_id
    bet_history_id = user_bet_history.id
    results = user_bet_history.required_result
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

    {ab, pp, _money} = Enum.reduce(results, {0, 0, 0}, fn row, {ab, pp, before} ->
      {
        ab + row.bet_amount,
        pp + row.rewarded_amount,
        before + row.rewarded_amount,
      }
    end)

    { total_lines, lines } = Enum.reduce(results,
      {%{}, []},
      fn %{type: type, value: value, rewarded_amount: rewarded_amount}, {acc, lines} ->
      bet_levels = Enum.find(user_bet_history.user_bets_level_result, fn ublr -> ublr.type == type end)

      new_acc = acc
        |> Map.put(String.to_atom("#{type}_line_taken"), value)
        |> Map.put(String.to_atom("#{type}_line_difficulty_taken"), bet_levels.level)
        |> Map.put(String.to_atom("#{type}_line_possible_payout"), rewarded_amount)
      {new_acc, lines ++ [type]}
    end)

    team_size = length(team.teammates)

    {
      total_amount_bet,
      total_possible_payout,
    } = Enum.reduce(team.teammates, {0, 0}, fn team_user, {tab, tpp} ->
      balance_before = team_user.user.wallet.funds + ab

      # new deposit
      extra_info = case Api.get_report_event(team_user.user_id, "bet_placed") do
        {:ok, %{additional_info: additional_info}} ->
          %{
            user_id: team_user.user_id,
            event_name: "bet_placed",
            value: bet_id,
            additional_info: %{
              bets_count: additional_info["bets_count"] + 1,
              bets_count_lost: additional_info["bets_count_lost"],
              bets_count_won: additional_info["bets_count_won"],
              bets_amount_total: additional_info["bets_amount_total"] + ab,
              bets_amount_won: additional_info["bets_amount_won"],
              bets_amount_lost: additional_info["bets_amount_lost"],
              bets_total: additional_info["bets_total"] + ab,
            }
          }
          |> Api.save_report_event!()
          |> Map.get(:additional_info)
        _ ->
          additional_info = %{
              user_id: team_user.user_id,
              event_name: "user_first_bet_amount",
              value: "#{ab}",
              additional_info: %{
                first_game_played: "wz",
                first_map_played: user_bet_history.map,
                first_game_mode_played: (if user_bet_history.map == :rebirth_island, do: "resurgence", else: "br")
              }
            }
            |> Api.save_report_event!()
            |> Map.get(:additional_info)

          %{
            user_id: team_user.user_id,
            event_name: "bet_placed",
            value: bet_id,
            additional_info: Map.merge(additional_info, %{
              bets_count: 1,
              bets_count_lost: 0,
              bets_count_won: 0,
              bets_amount_total: ab,
              bets_amount_won: 0,
              bets_amount_lost: 0,
              bets_total: 0,
            })
          }
          |> Api.save_report_event!()
          |> Map.get(:additional_info)
      end

      Segment.identify(team_user.user, extra_info)
      Segment.track("bet placed (user)", team_user.user_id, %{
        bet_id: bet_history_id,
        team_id: team.id,
        # Balance Info
        balance_before: balance_before,
        balance_after: team_user.user.wallet.funds,
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
        win_bet_taken: Enum.member?(lines, :match),
        total_amount_bet: ab,
        total_possible_payout: pp,
      })
      {tab + ab, tpp + pp}
    end)

    Segment.track("bet placed (team)", team.id, %{
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
      total_possible_payout: total_possible_payout
    })
    :ok
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(30)

end
