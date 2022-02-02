# Script for populating the database. You can run it as:
#
#     mix run priv/repo/populate_probabilities.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     PlConnect.Repo.insert!(%PlConnect.SomeSchema{})
#
# We recommend using the bang functios (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

require Ash.Query

alias PlConnect.Api
alias PlConnect.Cod.User
alias PlConnect.Cod.Feature
alias PlConnect.Cod.BetLines

defmodule PopulateProbabilities do
  @verdansk_solo_duos ["Solos", "Duos"]
  @verdansk_trios ["Trios"]
  @verdansk_quads ["Quads"]

  @rebirth_island_solo_duos [
    "Rebirth: Mini Royale",
    "Rebirth: Resurgence",
    "br_rbrthduos",
    "br_rebirth_brduos",
    "br_rebirth_rebirth_mini_royale_duos",
    "br_rebirth_mini_royale_duos",
    "br_mini_rebirth_mini_royale_solos",
    "br_rebirth_mini_royale_solo",
    "br_rebirth_rebirth_mini_royale_solo"
  ]
  @rebirth_island_trios [
    "br_rbrthtrios",
    "Rebirth: Mini Royale",
    "Rebirth: Resurgence"
  ]
  @rebirth_island_quads [
    "Rebirth: Mini Royale",
    "Rebirth: Resurgence",
    "br_rbrthduos",
    "br_rebirth_brduos",
    "br_rebirth_rebirth_mini_royale_duos",
    "br_rebirth_mini_royale_duos",
    "br_mini_rebirth_mini_royale_solos",
    "br_rebirth_mini_royale_solo",
    "br_rebirth_rebirth_mini_royale_solo"
  ]

  def user_data({:ok, %{id: id}}, seasons) do
    IO.inspect(id, label: :id)

    User
    |> Ash.Query.filter(id == ^id)
    |> Ash.Query.select([:id, :xbl_platform_username, :psn_platform_username])
    |> PlConnect.Api.read_one()
    |> case do
         {:ok, user} ->
           case {user.xbl_platform_username, user.psn_platform_username} do
             {nil, nil} -> :ok
             {xbl, nil} -> update_wzranked_probabilities(user.id, xbl, "xbl", seasons)
             {nil, psn} -> update_wzranked_probabilities(user.id, psn, "psn", seasons)
             {xbl, psn} ->
               update_wzranked_probabilities(user.id, xbl, "xbl", seasons)
               update_wzranked_probabilities(user.id, psn, "psn", seasons)
           end
         _ -> IO.inspect(id, label: :skipped)
       end
  end
  def update_wzranked_probabilities(user_id, username, platform, seasons) do
    data = BetLines.generate_lines(username, platform)
           |> BetLines.transform_data(:list)

    Api.add_new_wzranked_probabilities(user_id, data)
    IO.inspect(user_id, label: :populated)
  end
end
seasons = Feature.get_feature_flag(:bet_system_season)
         |> Map.get(:value)

File.stream!('./users.csv')
|> CSV.decode(
     headers: [:id]
   )
|> Enum.map(&PopulateProbabilities.user_data(&1, seasons))


#User
#|> Ash.Query.select([:id, :xbl_platform_username, :psn_platform_username])
#|> PlConnect.Api.read!()
#|> Enum.each(&(IO.inspect(&1.id)))
