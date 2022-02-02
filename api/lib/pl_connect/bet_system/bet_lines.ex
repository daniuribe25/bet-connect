defmodule PlConnect.Cod.BetLines do
  @moduledoc false

  alias PlConnect.Api
  alias PlConnect.Cod.Feature
  alias PlConnect.ApiClient.WzRanked
  alias PlConnect.Cod.BetLines.BuildProfile
  alias PlConnect.Cod.BetLines.BuildStats

  @top_matches_limit 40
  @empty_line %{season: "", damagedone: [], kills: [], placement: []}
  @default_line %{
    damagedone: [
      {4013, 1, 0.125, 0.125, 12.5},
      {2970, 1, 0.125, 0.25, 25.0},
      {1423, 1, 0.125, 0.5, 50.0}
    ],
    kills: [
      {9, 3, 0.17647058823529413, 0.17647058823529413, 17.647058823529413},
      {7, 1, 0.058823529411764705, 0.29411764705882354, 29.411764705882355},
      {4, 1, 0.058823529411764705, 0.5294117647058824, 52.94117647058824}
    ],
    placement: [
      {2, 9, 0.08571428571428572, 0.08571428571428572, 8.571428571428571},
      {10, 1, 0.009523809523809525, 0.16190476190476186, 16.190476190476186},
      {18, 1, 0.009523809523809525, 0.4666666666666668, 46.66666666666668}
    ]
  }

  def get_profile(uno, platform, game_mode, season, team_mode) do
    summary_season = WzRanked.get_summary_by_season!(uno, season, 1)
    vshareloaded = WzRanked.get_how_complete_profile!(uno, 1)
    gulag_information = WzRanked.get_gulag!(uno, season, 1)

    %{"uno" => uno}
    |> BuildProfile.get_how_complete!(vshareloaded, platform)
    |> BuildProfile.get_summary_by_game_mode!(summary_season, game_mode)
    |> BuildProfile.get_top_matches_by_property!(season, @top_matches_limit, game_mode, team_mode)
    |> BuildProfile.get_gulag!(gulag_information)
    |> (&{season, &1}).()
  end

  def get_individual_probabilities({season, profile}) do
    flag = Feature.get_feature_flag(:bet_system_percent)

    %{"property" => kills, "total" => total_kills} =
      BuildStats.get_basics!(profile["kills"], "kills", flag.value)

    %{"property" => damagedone, "total" => total_damagedone} =
      BuildStats.get_basics!(profile["damagedone"], "damagedone", flag.value)

    %{"property" => placement, "total" => total_placement} =
      BuildStats.get_basics!(profile["all"], "teamplacement", flag.value)

    %{
      season: season,
      kills: kills,
      total_kills: total_kills,
      damagedone: damagedone,
      total_damagedone: total_damagedone,
      placement: placement,
      total_placement: total_placement
      #      deaths: BuildStats.get_basics!(profile["deaths"], "deaths", flag.value),
      #      executions: BuildStats.get_basics!(profile["executions"], "executions", flag.value),
      #      headshots: BuildStats.get_basics!(profile["headshots"], "headshots", flag.value),
      #      longeststreak: BuildStats.get_basics!(profile["longeststreak"], "longeststreak", flag.value),
      #      contracts: BuildStats.get_basics!(profile["contracts"], "missionscomplete", flag.value),
      #      teamwiped: BuildStats.get_basics!(profile["teamwiped"], "objectiveteamwiped", flag.value)
    }
  end

  ##
  ## Entry point
  ## Players: ["username", "platform"]
  ## Game_mode: ["Solos","Duos"] or ["Trios"] or ["Quads"]
  def get_team_bet_lines(players, match_map, bet_category, squad_size) do
    mode =
      case squad_size do
        4 -> :quads
        3 -> :trios
        _ -> :solo_duos
      end

    game_mode =
      case match_map do
        :rebirth_island -> "rebirth_island_solo_duos"
        _ -> "verdansk_#{mode}"
      end
      |> String.to_atom()

    probabilities =
      Enum.map(players, fn x ->
        case Api.get_wzranked_probabilities_by_id(x.user.id) do
          {:ok, data} ->
            data =
              transform_data(data, :tuple)
              |> Map.get(game_mode, @default_line)

            if data == @empty_line, do: @default_line, else: data

          _ ->
            nil
        end
      end)

    if Enum.empty?(probabilities) or Enum.all?(probabilities, &is_nil/1) do
      nil
    else
      [
        kills: kills,
        placement: placement,
        damagedone: damagedone
        # deaths: deaths,
        # executions: executions,
        # headshots: headshots,
        # longeststreak: longeststreak,
        # contracts: contracts,
        # teamwiped: teamwiped
      ] =
        probabilities
        |> Enum.map(&(if is_nil(&1), do: Enum.at(probabilities, 0), else: &1))
        |> Enum.reduce([], fn x, res ->
          [
            :kills,
            :placement,
            :damagedone
          ]
          # [:kills, :deaths, :executions, :headshots, :longeststreak, :contracts, :teamwiped]
          |> Enum.map(fn y ->
            ans = Keyword.get(res, y, [])

            {y, ans ++ [x[y]]}
          end)
        end)

      flag = Feature.get_feature_flag(:bet_system_percent)
      bet_line_kills = BuildStats.get_bet_line(kills, flag.value * length(players), length(players))
      bet_line_damagedone = BuildStats.get_bet_line(damagedone, flag.value * length(players), length(players))
      bet_line_placement = BuildStats.get_bet_line(placement, flag.value * length(players), length(players))
      # bet_line_deaths = BuildStats.get_bet_line(deaths, flag.value)
      # bet_line_executions = BuildStats.get_bet_line(executions, flag.value)
      # bet_line_headshots = BuildStats.get_bet_line(headshots, flag.value)
      # bet_line_longeststreak = BuildStats.get_bet_line(longeststreak, flag.value)
      # bet_line_contracts = BuildStats.get_bet_line(contracts, flag.value)
      # bet_line_teamwiped = BuildStats.get_bet_line(teamwiped, flag.value)

      main = format_lines(bet_line_kills)
      kills = Enum.map(main, &Map.put(&1, :goal, &1.goal + 2))
      placement = format_lines(bet_line_placement)
      match = Enum.at(placement, 0) |> (&Map.put(&1, :goal, &1.goal - 2)).()

      {placement, match} =
        if match.goal < 1 do
          diff = 1 - match.goal
          placement = Enum.map(placement, &Map.put(&1, :goal, &1.goal + diff))
          {placement, [Map.put(match, :goal, 1)]}
        else
          {placement, [match]}
        end

      bet_lines = %{
        main: main,
        kills: kills,
        damage: format_lines(bet_line_damagedone),
        placement: placement,
        match: match
      }

      %PlConnect.Cod.Team.Embedded.Probabilities{
        game_mode: match_map,
        bet_category: bet_category,
        bet_lines: struct!(PlConnect.Cod.Team.Embedded.BetLine, bet_lines)
      }
    end
  end

  @keys_modes %{
    ["br_brduos", "br_brsolo"] => :verdansk_solo_duos,
    ["br_brtrios"] => :verdansk_trios,
    ["br_brquads"] => :verdansk_quads,
    ["br_rebirth_rbrthduos"] => :rebirth_island_solo_duos,
    ["br_rebirth_rbrthtrios"] => :rebirth_island_trios,
    ["br_rebirth_rbrthquad"] => :rebirth_island_quads
  }

  @default_lines %{
    verdansk_solo_duos: @default_line,
    verdansk_trios: @default_line,
    verdansk_quads: @default_line,
    rebirth_island_solo_duos: @default_line,
    rebirth_island_trios: @default_line,
    rebirth_island_quads: @default_line
  }

  def generate_lines(uno, platform) do
    data = WzRanked.get_seasons_with_matches!(uno)
      |> Enum.group_by(&(&1["mode"]))

    Map.keys(data)
    |> Enum.map(fn key ->
      Map.get(data, key)
      |> Enum.sort_by(&(&1["totalgames"]), &>=/2)
      |> Enum.at(0)
    end)
    |> Enum.flat_map(fn
      %{"mode" => m, "seasonname" => season} when m in ["Solos", "Duos"] ->
        [{["Solos", "Duos"], season, ["br_brduos", "br_brsolo"]}]

      %{"mode" => m, "seasonname" => season}
      when m in ["Rebirth: Mini Royale", "Rebirth: Resurgence"] ->
        [
          {["Rebirth: Mini Royale", "Rebirth: Resurgence"], season, ["br_rebirth_rbrthduos"]},
          {["Rebirth: Mini Royale", "Rebirth: Resurgence"], season, ["br_rebirth_rbrthtrios"]},
          {["Rebirth: Mini Royale", "Rebirth: Resurgence"], season, ["br_rebirth_rbrthquad"]}
        ]

      %{"mode" => m, "seasonname" => season}
      when m in ["Trios"] ->
        [{["Trios"], season, ["br_brtrios"]}]

      %{"mode" => m, "seasonname" => season}
      when m in ["Quads"] ->
        [{["Quads"], season, ["br_brquads"]}]

      %{"mode" => mode, "seasonname" => season} ->
        [{[mode], season, nil}]
    end)
    |> Enum.uniq()
    |> Enum.reduce(@default_lines, fn {mode, season, team_mode}, data ->
      prob =
        get_profile(uno, platform, mode, season, team_mode)
        |> get_individual_probabilities()

      key = Map.get(@keys_modes, team_mode)
      Map.put(data, key, prob)
    end)
  end

  defp filter(lines) when length(lines) <= 3, do: lines

  defp filter(lines) do
    index_1 = 0
    index_2 = abs(length(lines) / 2) |> trunc()
    index_3 = length(lines) - 1

    [Enum.at(lines, index_1), Enum.at(lines, index_2), Enum.at(lines, index_3)]
  end

  defp format_lines(lines),
    do:
      lines
      |> Enum.map(&to_line/1)
      |> filter()
      |> Enum.with_index()
      |> Enum.map(&Map.put(elem(&1, 0), :level, elem(&1, 1)))

  defp to_line(%{"Quantity" => goal, "Payout" => payout}) do
    %{
      goal: goal,
      payout: payout
    }
  end

  def transform_data(probabilities, type) when type in [:tuple, :list] do
    func =
      case type do
        :tuple -> &List.to_tuple/1
        :list -> &Tuple.to_list/1
      end

    [
      :verdansk_solo_duos,
      :verdansk_trios,
      :verdansk_quads,
      :rebirth_island_solo_duos
    ]
    |> Enum.reduce(%{}, fn key, acc ->
      data = Map.get(probabilities, key)

      data =
        Map.keys(data)
        |> Enum.reduce(%{}, fn k, a ->
          data =
            Map.get(data, k)
            |> (&if(is_list(&1), do: Enum.map(&1, func), else: &1)).()

          k = if is_atom(k), do: k, else: String.to_atom(k)
          Map.put(a, k, data)
        end)

      key = if is_atom(key), do: key, else: String.to_atom(key)
      Map.put(acc, key, data)
    end)
  end
end
