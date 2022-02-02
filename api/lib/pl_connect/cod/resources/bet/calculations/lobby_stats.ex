defmodule PlConnect.Cod.Resource.Bet.Calculation.LobbyStats do
  use Ash.Calculation

  require Ash.Query

  alias PlConnect.Api

  def calculate(records, _, _) do
    Enum.map(records, fn record ->
      case record.result_match_cod_id do
        nil -> nil
        cod_id ->
          matches = Api.get_matches_by_cod_id!(cod_id)
          stats = Enum.map(matches, fn match ->
              segment = match.json_response |> Map.get("segments") |> Enum.at(0)
              %{
                kda: get_in(segment, ["stats", "kdRatio", "value"]),
                kills: get_in(segment, ["stats", "kills", "value"]),
                time_alive: get_in(segment, ["stats", "timePlayed", "value"])
              }
            end)
            |> Enum.reduce(%{kda: 0, kills: 0, time_alive: 0}, fn val, %{kda: kda, kills: kills, time_alive: time_alive} ->
              %{
                kda: kda + val.kda,
                kills: kills + val.kills,
                time_alive: time_alive + val.time_alive
              }
            end)
          Map.put(stats, :kda, stats.kda / length(matches))
          |> Map.put(:kills, stats.kills / length(matches))
          |> Map.put(:time_alive, stats.time_alive / length(matches))
          |> (&struct(PlConnect.Cod.Bet.LobbyStats, &1)).()
      end
    end)
  end

end