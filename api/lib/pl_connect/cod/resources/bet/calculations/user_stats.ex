defmodule PlConnect.Cod.Resource.Bet.Calculation.UserStats do
  use Ash.Calculation

  require Ash.Query

  alias PlConnect.Api

  def calculate(records, _, _) do
    Enum.map(records, fn record ->
      case record.result_match_cod_id do
        nil -> []
        cod_id ->
          Api.get_matches_by_cod_id!(cod_id)
          |> Enum.map(fn match ->
            segment = match.json_response |> Map.get("segments") |> Enum.at(0)
            gulag = case segment do
              %{"stats" => %{"gulagKills" => %{"value" => 1.0}}} -> true
              %{"stats" => %{"gulagDeaths" => %{"value" => 1.0}}} -> false
              _ -> nil
            end
            Map.take(match, [:damage, :kills, :placement, :platform_username, :user_id, :platform])
              |> Map.merge(%{
                gulag: gulag,
                deaths: get_in(segment, ["stats", "deaths", "value"]),
                assists: get_in(segment, ["stats", "assists", "value"])
              })
          end)
      end
    end)
  end

end