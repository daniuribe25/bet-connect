# Script for populating the database. You can run it as:
#
#     mix run priv/repo/parties_csv.exs
#

require Ash.Query

alias PlConnect.Api

defmodule PlConnect.Seeds do
  def generate_report(party) do
    case party do
      {:ok, %{match_type: "MATCH_TYPE"}} -> []
      {:ok, party} ->
        squad_size = case party.match_type do
          "DUOS" -> :duos
          "TRIOS" -> :trios
          "QUADS" -> :quads
          _ -> :quads
        end
        {user_ids, defined} = [:player_1, :player_2, :player_3, :player_4]
          |> Enum.reduce({[], []}, fn key, {ids, defined} ->
            Map.get(party, key)
            |> case  do
              "" -> {ids, defined}
              "BETTOR" -> {ids, defined ++ [3]}
              "NON_BETTOR" -> {ids, defined ++ [0]}
              user_id -> {ids ++ [user_id], defined}
            end
          end)

        values = PlConnect.Cod.PlayerMatch
          |> Ash.Query.filter(user_id in ^user_ids and match_map == :rebirth_island)
          |> Ash.Query.sort(match_date: :asc)
          |> Ash.Query.select([:id, :kills, :user_id])
          |> Api.read!()
          |> Enum.group_by(&(&1.user_id))
        lines = Enum.map(user_ids, fn id ->
          values = Map.get(values, id, [])
          case values do
            [] -> 3
            values -> values |> Enum.map(&(&1.kills)) |> Enum.sum() |> Kernel./(length(values))
          end
        end)
        |> Kernel.++(defined)
        |> Enum.sum()
                |> IO.inspect(label: "average")
        |> Api.get_rebirth_line(squad_size, "1.0")
        |> case  do
             {:ok, line} -> [line]
             _ -> []
           end
      _ -> []
    end
  end
end

File.stream!('./parties.csv')
|> CSV.decode(
  headers: [:match_type, :player_1, :player_2, :player_3, :player_4]
)
|> Enum.flat_map(&PlConnect.Seeds.generate_report/1)
|> Enum.map(fn line ->
  IO.inspect("#{line.mean_kills_sum},#{line.kills_bet_1},#{line.kills_bet_2},#{line.kills_bet_3},#{line.payout_bet_1},#{line.payout_bet_2},#{line.payout_bet_3}")
end)
|> IO.inspect(label: "Rebirth lines completed!")
