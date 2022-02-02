defmodule PlConnect.Workers.Analytics.TrackRefund do
  @moduledoc """
  Ran ONLY when an user isnt verified by berbix
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

    {ab, pp, extras} = Enum.reduce(results, {0, 0, []}, fn row, {ab, pp, extras} ->
      {
        ab + row.bet_amount,
        pp + row.rewarded_amount,
        Keyword.put(extras, row.type, row.value)
      }
    end)

    { total_lines, lines } = Enum.reduce(extras, {%{}, []}, fn {line, value}, {acc, lines} ->
      new_acc = acc
        |> Map.put(String.to_atom("#{line}_line_taken"), value)
      {new_acc, lines ++ [line]}
    end)

    team_size = length(team.teammates)

    spawn(fn ->
      {
        total_amount_bet,
        total_possible_payout
      } = Enum.reduce(team.teammates, {0, 0}, fn team_user, {tab, tpp} ->
        extra_info = case Api.get_report_event_value(team_user.user_id, bet_id, "bet_placed") do
          {:ok, last_report} -> last_report.additional_info
          _ -> %{message: "error getting the last report"}
        end
        Segment.identify(team_user.user, extra_info)
        Segment.track("bet refunded (user)", team_user.user_id, %{
          bet_id: bet_history_id,
          team_id: team.id,
          team_size: team_size,
          map: user_bet_history.map,
          in_game_squad_size: team.squad_size,
          mode: mode,
          enough_data_to_generate_lines: team.use_generated,
          lines_taken: total_lines,
          total_amount_bet: ab,
          total_possible_payout: pp
        })
        {tab + ab, tpp + pp}
      end)

      Segment.track("bet refunded (team)", team.id, %{
        bet_id: bet_history_id,
        team_id: team.id,
        # Game info
        team_size: team_size,
        map: user_bet_history.map,
        in_game_squad_size: team.squad_size,
        enough_data_to_generate_lines: team.use_generated,
        mode: mode,
        # Specific line info
        lines: total_lines,
        # High level info
        main_bet_format: main_bet_format,
        lines_taken: lines,
        total_amount_bet: total_amount_bet,
        total_possible_payout: total_possible_payout
      })
    end)
    :ok
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(30)

end
