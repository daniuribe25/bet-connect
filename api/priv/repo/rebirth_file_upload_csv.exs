# Script for populating the database. You can run it as:
#
#     mix run priv/repo/rebirth_file_upload_csv.exs
#

alias PlConnect.Api

defmodule PlConnect.Seeds do
  def populate_rebirth_lines_from_csv(line) do
    {:ok, line} = line

    advantage = case line.advantage do
      "PLAYER" -> :player
      "NEUTRAL" -> :neutral
      "HOUSE" -> :house
      _ -> :unknown
    end
    team_size = case line.team_size do
      "DUOS" -> :duos
      "TRIOS" -> :trios
      "QUADS" -> :quads
      _ -> :unknown
    end

    args = %{
      mean_kills_sum: line.mean_kills_sum,
      advantage: advantage,
      team_size: team_size,
      kills_bet_1: line.kills_bet_1,
      kills_bet_2: line.kills_bet_2,
      kills_bet_3: line.kills_bet_3,
      payout_bet_1: line.payout_bet_1,
      payout_bet_2: line.payout_bet_2,
      payout_bet_3: line.payout_bet_3
    }

    case Api.create_rebirth_line(args) do
      {:ok, bet_value} ->
        Map.take(bet_value, [:id, :mean_kills_sum, :advantage, :team_size, :kills_bet_1, :kills_bet_2, :kills_bet_3, :payout_bet_1, :payout_bet_2, :payout_bet_3])
        :ok

      {:error, error} ->
        %{id: :error, error: error} |> IO.inspect(label: "Error inserting the line")
        :error
    end
  end
end

File.stream!('./rebirth_lines.csv')
|> CSV.decode(
  headers: [:id, :mean_kills_sum, :advantage, :team_size, :kills_bet_1, :kills_bet_2, :kills_bet_3, :payout_bet_1, :payout_bet_2, :payout_bet_3]
)
|> Enum.map(&PlConnect.Seeds.populate_rebirth_lines_from_csv/1)
|> IO.inspect(label: "Rebirth lines completed!")
