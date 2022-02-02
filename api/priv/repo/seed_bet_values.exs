# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seed_bet_values.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     PlConnect.Repo.insert!(%PlConnect.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias PlConnect.Api

defmodule PlConnect.Seeds do

  @bet_values %{
    rookie: %{
      level: 1,
      goal: 8,
      payout: 3,
      min_kda: 0.1,
      max_kda: 1.6
    },
    legend: %{
      level: 2,
      goal: 14,
      payout: 4,
      min_kda: 0.8,
      max_kda: 2.0
    },
    diamond: %{
      level: 3,
      goal: 20,
      payout: 5,
      min_kda: 1.2,
      max_kda: 2.5
    }
  }

  def populate_bet_values do
    modes = [:verdansk, :rebirth_island]
    categories = [:rookie, :legend, :diamond]
    types = [:main, :kills, :placement, :damage, :match]
    Enum.each(modes, fn mode ->
      Enum.each(categories, fn cat ->
        Enum.each(types, fn type ->
          {:ok, _} =
            Map.get(@bet_values, cat)
            |> Map.merge(%{
              game_mode: mode,
              bet_category: cat,
              type: type
            })
            |> Api.create_bet_values()
            |> IO.inspect(label: "bet_values")
        end)
      end)
    end)
  end
end

PlConnect.Seeds.populate_bet_values()
