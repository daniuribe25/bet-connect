# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seed_bet_values_csv.exs
#

alias PlConnect.Api

defmodule PlConnect.Seeds do
  def populate_bet_values_from_csv(bet_value) do
    {:ok, bet_value} = bet_value

    args = %{
      game_mode: bet_value.game_mode,
      type: bet_value.type,
      bet_category: bet_value.bet_category,
      level: bet_value.level,
      goal: bet_value.goal,
      payout: bet_value.payout,
      min_kda: bet_value.min_kda,
      max_kda: bet_value.max_kda
    }

    case Api.create_bet_values(args) do
      {:ok, bet_value} ->
        Map.take(bet_value, [:id, :game_mode, :type, :bet_category, :level, :goal, :payout, :min_kda, :max_kda])
        :ok

      {:error, error} ->
        %{id: :error, error: error} |> IO.inspect(label: "Error inserting the bet value")
        :error
    end
  end
end

File.stream!('./seed_bet_values.csv')
|> CSV.decode(
  headers: [:game_mode, :type, :bet_category, :level, :goal, :payout, :min_kda, :max_kda]
)
|> Enum.map(&PlConnect.Seeds.populate_bet_values_from_csv/1)
|> IO.inspect(label: "Bet values completed!")
