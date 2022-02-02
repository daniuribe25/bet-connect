defmodule PlConnect.Cod.Team.Calculation.Difficulty do
  use Ash.Calculation

  require Ash.Query

  alias PlConnect.Api

  def calculate(records, _, _) do
    Enum.map(records, fn record ->
      record = Api.load!(record, [teammates: [:user]])
      keys = Ash.Resource.Info.attribute(PlConnect.Cod.User, :difficulty)
        |> Map.get(:default)
        |> Map.keys()
      
      Enum.reduce(record.teammates, [], fn mate, acc ->
        Enum.map(keys, fn key ->
          mate_value = Map.get(mate.user.difficulty, key) |> Map.get("value", 0)
          current_value = Keyword.get(acc, key, 0)
          {key, mate_value + current_value}
        end)
      end)
      |> Enum.reduce(%{}, fn {key, value}, acc -> Map.put(acc, key, value / length(record.teammates)) end)
    end)
  end

end
