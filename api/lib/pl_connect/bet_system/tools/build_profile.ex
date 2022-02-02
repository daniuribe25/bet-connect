defmodule PlConnect.Cod.BetLines.BuildProfile do

  alias PlConnect.ApiClient.WzRanked

  @platform_map %{"psn" => "PlayStation", "xbl" => "Xbox", "battlenet" => "Activision ID"}

  def get_how_complete!(profile, vshareloaded, platform) do
    filtered_items =
      Enum.filter(vshareloaded, fn x ->
        x["platform"] == @platform_map[platform]
      end)

    vshareloaded_filtered = List.first(filtered_items)

    profile
    |> Map.put("complete", vshareloaded_filtered["shareloaded"])
    |> Map.put("totalMatches", vshareloaded_filtered["totalcount"])
  end

  def get_summary_by_game_mode!(profile, summary_season, game_mode) do
    filtered_items =
      Enum.filter(summary_season, fn x ->
        x["mode"] == game_mode
      end)

    summary_seasonFiltered = List.first(filtered_items)
    Map.put(profile, "summary", summary_seasonFiltered)
  end

  def get_gulag!(profile, gulag_information) do
    gulag =
      Enum.map(gulag_information, fn info ->
        gulag = %{"totalGulagGames" => 0, "totalGulagWins" => 0}
        games = gulag["totalGulagGames"] + info["totalgulaggames"]
        wins = gulag["totalGulagWins"] + info["totalgulagwins"]
        gulag = Map.put(gulag, "totalGulagGames", games)
        gulag = Map.put(gulag, "totalGulagWins", wins)
        gulag
      end)

    Map.put(profile, "gulag", gulag)
  end

  def get_top_matches_by_property!(profile, season, limit, mode, team_mode) do
    kills = WzRanked.get_top_matches_kills!(profile["uno"], season, limit, mode, team_mode)
    damagedone = WzRanked.get_top_matches_damagedone!(profile["uno"], season, limit, mode, team_mode)
#    deaths = WzRanked.get_top_matches_deaths!(profile["uno"], season, limit, mode)
#    executions = WzRanked.get_top_matches_executions!(profile["uno"], season, limit, mode)
#    headshots = WzRanked.get_top_matches_headshots!(profile["uno"], season, limit, mode)
#    longeststreak = WzRanked.get_top_matches_longeststreak!(profile["uno"], season, limit, mode)
#    contracts = WzRanked.get_top_matches_contracts!(profile["uno"], season, limit, mode)
#    teamwiped = WzRanked.get_top_matches_teamwiped!(profile["uno"], season, limit, mode)

    all = kills ++ damagedone
#      |> Kernel.++(deaths)
#      |> Kernel.++(executions)
#      |> Kernel.++(headshots)
#      |> Kernel.++(longeststreak)
#      |> Kernel.++(contracts)
#      |> Kernel.++(teamwiped)
      |> Enum.sort(&(&1["teamplacement"] > &2["teamplacement"]))

    profile
    |> Map.put("kills", kills)
    |> Map.put("damagedone", damagedone)
#    |> Map.put("deaths", deaths)
#    |> Map.put("executions", executions)
#    |> Map.put("headshots", headshots)
#    |> Map.put("longeststreak", longeststreak)
#    |> Map.put("contracts", contracts)
#    |> Map.put("teamwiped", teamwiped)
    |> Map.put("all", all)
  end
end
