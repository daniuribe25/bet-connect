defmodule PlConnect.Cod.BetLines.BuildStats do
  def get_basics!(matches, property_name, percent) do
    total_property =
      Enum.map(matches, fn x ->
        x[property_name]
      end)

    reverse = property_name == "teamplacement"

    %{"frequency" => frequency, "total_property" => total_property} =
      fix_frequency_table!(total_property)

    total = Enum.sum(total_property)

    %{
      "property" => get_absolute_table!(frequency, total_property, reverse, percent),
      "total" => total
    }
  end

  def get_frequency_table!(total_property) do
    Enum.frequencies(total_property)
  end

  def fix_frequency_table!([]), do: %{"frequency" => [], "total_property" => []}

  def fix_frequency_table!(total_property) do
    max_value = Enum.max(total_property)
    min_value = Enum.min(total_property)
    min_value = if is_nil(min_value) or min_value == 0, do: 1, else: min_value

    if max_value < 99 do
      numbers = min_value..max_value |> Enum.to_list()
      final_list = Enum.concat(numbers, total_property)
      final_frequency = get_frequency_table!(final_list)
      %{"frequency" => final_frequency, "total_property" => final_list}
    else
      step = (max_value - min_value) / 8
      _intervals = get_intervals_and_means(min_value, max_value, step, [])
      frequency = get_frequency_table!(total_property)
      # Missing for damage done
      %{"frequency" => frequency, "total_property" => total_property}
    end
  end

  defp get_intervals_and_means(min_value, max_value, _, intervals) when min_value >= max_value,
    do: intervals

  defp get_intervals_and_means(min_value, max_value, step, intervals) do
    answer = %{
      "value1" => min_value,
      "value2" => min_value + step,
      "mean" => (min_value + step) / 2
    }

    get_intervals_and_means(min_value + step, max_value, step, intervals ++ [answer])
  end

  defp tuple_last_element(tuple) do
    last_index = tuple_size(tuple) - 1
    elem(tuple, last_index)
  end

  defp absolute_value([], _, _, answer), do: answer

  defp absolute_value([head | tail], valor_anterior, indice, answer) do
    last_value = tuple_last_element(head)
    a = last_value + valor_anterior
    answer = answer ++ [Tuple.append(head, a)]
    absolute_value(tail, a, indice + 1, answer)
  end

  def get_absolute_table!(frequency, total_property, reverse, percent) do
    total = length(total_property)

    a =
      Enum.map(frequency, fn x ->
        last_value = tuple_last_element(x)
        Tuple.append(x, last_value / total)
      end)
      |> Enum.sort_by(&elem(&1, 0))
      |> (&if(reverse, do: &1, else: Enum.reverse(&1))).()

    b = absolute_value(a, 0, 0, [])

    b =
      Enum.map(b, fn x ->
        last_value = tuple_last_element(x)
        Tuple.append(x, last_value * 100)
      end)

    Enum.filter(b, fn x ->
      last_value = tuple_last_element(x)
      last_value < percent
    end)
  end

  defp permutation(player, player2) do
    Enum.map(player, fn x ->
      Enum.map(player2, fn y ->
        quantity1 = elem(x, 0)
        percent1 = tuple_last_element(x)
        quantity2 = elem(y, 0)
        percent2 = tuple_last_element(y)
        {quantity1 + quantity2, percent1 + percent2}
      end)
    end)
    |> Enum.reduce([], fn x, res ->
      res ++ x
    end)
  end

  defp resolve_permutation(permutations, percent) do
    permutations
    |> Enum.sort(&(elem(&1, 0) < elem(&2, 0)))
    |> Enum.chunk_by(&elem(&1, 0))
    |> Enum.flat_map(fn x ->
      element =
        Enum.sort(x, &(elem(&1, 1) >= elem(&2, 1)))
        |> List.first()

      if elem(element, 1) < percent do
        [element]
      else
        []
      end
    end)
  end

  def get_bet_line(players, percent, length) when length(players) >= 2 do
    [actual_perm | rest] = players
    [player2 | rest] = rest
    perm = permutation(actual_perm, player2)
    get_bet_line([perm] ++ rest, percent, length)
  end

  def get_bet_line([perm], percent, length) do
    resolved = resolve_permutation(perm, percent)

    Enum.flat_map(resolved, fn x ->
      if elem(x, 0) == 0 do
        []
      else
        dividor = tuple_last_element(x)
        dividor = if dividor < 10 or dividor == 0, do: 1 / 0.1, else: dividor

        [
          %{
            "Quantity" => elem(x, 0),
            "Percent" => tuple_last_element(x) / length,
            "Payout" => 100 * length / dividor
          }
        ]
      end
    end)
  end
end
