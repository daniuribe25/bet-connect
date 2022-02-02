defmodule PlConnect.Cod.Team.Calculation.ProbabilitiesCalculated do
  @moduledoc """
  all lines are calculated here, based on the main bet lines and adjusted per team

  the goal defined on the bet line will be reduced by the number of the team members and multiplied by the difficulty
  of the whole team
  """
  use Ash.Calculation

  require Ash.Query

  alias PlConnect.Api
  alias PlConnect.Cod.Team
  alias PlConnect.Cod.Feature

  def calculate(records, _, _) do
    Enum.map(records, fn %Team{} = record ->
      flag = Feature.get_feature_flag(:wzranked_engine)
      record = Api.load!(record, [:difficulty, :teammates])

      if flag.value and !is_nil(record.probabilities_generated) do
        %{probabilities: %{bet_lines: bet_lines} = probabilities} = record
        %{probabilities_generated: %{bet_lines: generated_bet_lines}} = record
        generated_bet_lines = Map.put(bet_lines, :main, generated_bet_lines.main)
          |> Map.put(:kills, [])

        Map.put(probabilities, :bet_lines, generated_bet_lines)
      else
        %{probabilities: %{bet_lines: bet_lines} = probabilities} = record
        # lines must be designed for 4 players
        reducer = "reducer_#{length(record.teammates)}"
          |> String.to_atom()
          |> Feature.get_feature_flag()
          |> Map.get(:value, 1)

        lines_calculated = apply_difficulty(bet_lines, record.difficulty, length(record.teammates), record.squad_size, reducer)

        main = Enum.at(lines_calculated.main, 0) |> Map.get(:goal)
        kills =  Enum.at(lines_calculated.kills, 0) |> Map.get(:goal)
        diff = main - kills
        lines_calculated = if diff >= 0 do
          Enum.map(lines_calculated.kills, &Map.put(&1, :goal, &1.goal + diff + 1))
          |> (&Map.put(lines_calculated, :kills, &1)).()
        else
          lines_calculated
        end

        Map.put(probabilities, :bet_lines, lines_calculated)
      end
    end)
  end

  defp apply_difficulty(bet_lines, difficulty, players_count, squad_size, reducer) do
    squad_size = if is_nil(squad_size) or squad_size == 0, do: players_count, else: squad_size
    flag = Feature.get_feature_flag(:squad_grow)
    squad_extra = (squad_size - players_count) * flag.value

    [:main, :kills, :placement, :damage, :match]
    |> Enum.reduce(bet_lines, fn key, data ->
      extra = Map.get(difficulty, key, 0)
      Map.get(bet_lines, key)
      |> Enum.map(&Map.put(&1, :goal, calculate_goal(key, &1, reducer + squad_extra, extra) |> Float.ceil() |> trunc()))
      |> Enum.reduce([], fn
        current, [] -> [current]
        current, data ->
          {compare_func, extra} = case key do
            :placement -> {&Kernel.>=/2, -1}
            :damage -> {&Kernel.<=/2, 200}
            _ -> {&Kernel.<=/2, 1}
          end
          last_element = List.last(data)
          current = if compare_func.(current.goal, last_element.goal), do: Map.put(current, :goal, last_element.goal + extra), else: current
          data ++ [current]
      end)
      |> Enum.dedup_by(&(&1.goal))
      |> Enum.take(3)
      |> (&Map.put(data, key, &1)).()
    end)
  end

  defp calculate_goal(:placement, %{goal: goal}, reducer, extra),
       do: (goal / reducer)
           |> Kernel.-(extra)
           |> min_value(2.0)
  defp calculate_goal(key, %{goal: goal}, reducer, extra) when key in [:main, :kills],
       do: (goal * reducer)
           |> Kernel.+(extra)
           |> min_value(1.0)
  defp calculate_goal(_, %{goal: goal}, reducer, multiplier),
       do: (goal * reducer)
           |> Float.ceil()
           |> Kernel.*(multiplier + 1)
           |> min_value(1.0)

  defp min_value(val, default) when val < default, do: default
  defp min_value(val, _), do: val
end
