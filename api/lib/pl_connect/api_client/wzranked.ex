defmodule PlConnect.ApiClient.WzRanked do
  @moduledoc """
  Api wrapper for the warzone api for tracker.gg
  """

  @wzranked_url "https://codstats.hasura.app/v1/graphql"
  @valid_platforms ["psn", "xbl", "battlenet", :psn, :xbl, :battlenet]

  defp neuron_config() do
    Neuron.Config.set(url: @wzranked_url)
    Neuron.Config.set(connection_module: PlConnect.Neuron.Connection)
  end

  defp remap_platform(platform) do
    case platform do
      "battlenet" -> "battle"
      :battlenet -> "battle"
      _ -> platform

    end
  end

  def fetch_user(username, platform) do
    platform = remap_platform(platform)
    variables = %{"gamer" => username, "platform" => platform}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query fetchUser($gamer: String!, $platform: String!) {
           searchUser(gamer: $gamer, platform: $platform) {
             uno
           __typename
         }
        }
        """,
        variables
      )

    body
  rescue
    _ -> nil
  end

  def search_user(username, platform) do
    platform = remap_platform(platform)
    variables = %{"gamer" => username, "platform" => platform}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        mutation searchUser($gamer: String = "", $platform: String = "") {  insert_searches_one(object: {countsearches: 1, platform: $platform, gamer: $gamer}, on_conflict: {constraint: searches_pkey, update_columns: countsearches}) {    platform    gamer    searchtousername {      uno      __typename    }    __typename  }}
        """,
        variables
      )

    body
  rescue
    _ -> nil
  end

  def get_uno_wzranked!(username, platform) when platform in @valid_platforms do
    platform = remap_platform(platform)
    case fetch_user(username, platform) do
      %{"data" => %{"searchUser" => %{"uno" => uno}}} ->
        search_user(username, platform)
        uno
      %{"errors" => [%{"message" => "User found in COD API, but user has not played any matches"}]} -> :not_enough_data
      %{"errors" => [%{"message" => "Not permitted: not allowed"}]} -> :private_profile
      _ -> :not_found
    end
  end

  def get_seasons_with_matches!(uno) do
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query checkGameCount($uno: String!) {  aggmodesoneseason(where: {uno: {_eq: $uno}}) {    seasonname    mode    totalgames }}
        """,
        %{"uno" => uno}
      )

    case body do
      %{data: %{aggmodesoneseason: aggmodesoneseason}} -> aggmodesoneseason
      %{"data" => %{"aggmodesoneseason" => aggmodesoneseason}} -> aggmodesoneseason
    end
  end

  def get_how_complete_profile!(uno, version) do
    variables = %{"uno" => uno, "version" => version}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getShareLoaded($uno: String!, $version: Int!) {  vshareloaded(where: {uno: {_eq: $uno}, dummy: {_lte: $version}}) {    platform    statusmessage    lastrefresh    totalcount   shareloaded    lastfound    __typename }}
        """,
        variables
      )

    case body do
      %{data: %{vshareloaded: vshareloaded}} -> vshareloaded
      %{"data" => %{"vshareloaded" => vshareloaded}} -> vshareloaded
    end
  end

  def get_summary_by_season!(uno, season, version \\ 1) do
    variables = %{"uno" => uno, "season" => season, "version" => version}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getAggModesOneSeason($uno: String!, $season: String!, $version: Int!) {  aggmodesoneseason(order_by: {seasonname: desc}, where: {uno: {_eq: $uno}, seasonname: {_eq: $season}, dummy: {_lte: $version}}) { avgdamagedone avgdamagetaken avgdeaths  avgdowns  avgdt  avgkd  avgkills  avgscore  dummy  exclude  gulagwinpct  headshotpct  iscurrent  maxkills  mode  placementpct  playedenoughmatches  playedlastweek  playedminimummatches  recordkills  seasonname  totaldamagedone  totaldamagetaken  totaldeaths  totaldowns  totalgames  totalgulaggames  totalgulagwins  totalheadshots  totalkills  totalplacement  totalscore  totalteamcount  totalwins  uno  updated_at  winpct  __typename  }}
        """,
        variables
      )

    case body do
      %{data: %{aggmodesoneseason: aggmodesoneseason}} -> aggmodesoneseason
      %{"data" => %{"aggmodesoneseason" => aggmodesoneseason}} -> aggmodesoneseason
    end
  end

  def get_top_matches_kills!(uno, season, limit, mode, team_mode) do
    neuron_config()
    variables = %{"uno" => uno, "season" => season, "limit" => limit, "mode" => mode}
    variables = if team_mode, do: Map.put(variables, "team_mode", team_mode), else: variables
    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getTopMatchesAllModesOneSeason($uno: String!, $season: String!, $limit: Int!, $mode: [String!], $team_mode: [String!]) {  vmatches(order_by: {utcstartseconds: desc},  where: { _and: [{uno: {_eq: $uno}},{ modename:{_in: $mode}}, {mode:{_in: $team_mode}},{seasonname: {_eq: $season}}]}, limit: $limit) { assists   deaths downs executions gametype headshots  kills longeststreak map matchid mode modename nearmisses playercount privatematch  seasonname team teamcount teamplacement teamsurvivaltime timeplayed uno username  }}
        """,
        variables
      )

    case body do
      %{data: %{vmatches: vmatches}} -> vmatches
      %{"data" => %{"vmatches" => vmatches}} -> vmatches
    end
  end
  def get_top_matches_damagedone!(uno, season, limit, mode, team_mode) do
    variables = %{"uno" => uno, "season" => season, "limit" => limit, "mode" => mode}
    variables = if team_mode, do: Map.put(variables, "team_mode", team_mode), else: variables
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getTopMatchesAllModesOneSeason($uno: String!, $season: String!, $limit: Int!, $mode: [String!], $team_mode: [String!]) {  vmatches(order_by: {utcstartseconds: desc},  where: { _and: [{uno: {_eq: $uno}},{ modename:{_in: $mode}},{mode:{_in: $team_mode}} ,{seasonname: {_eq: $season}}]}, limit: $limit) {  damagedone damagetaken assists deaths downs executions gametype headshots  kills longeststreak map matchid mode modename nearmisses playercount privatematch  seasonname team teamcount teamplacement teamsurvivaltime timeplayed uno username  }}
        """,
        variables
      )

    case body do
      %{data: %{vmatches: vmatches}} -> vmatches
      %{"data" => %{"vmatches" => vmatches}} -> vmatches
    end
  end
  def get_top_matches_deaths!(uno, season, limit, mode, version \\ 1) do
    variables = %{"uno" => uno, "season" => season, "version" => version, "limit" => limit, "mode" => mode}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getTopMatchesAllModesOneSeason($uno: String!, $season: String!, $version: Int!, $limit: Int!, $mode: [String!]) {  vmatches(order_by: {utcstartseconds: desc},  where: { _and: [{uno: {_eq: $uno}},{ modename:{_in: $mode}} ,{seasonname: {_eq: $season}}, {exclude: {_eq: false}},{ dummy: {_lte: $version}}]}, limit: $limit) {  assists deaths downs executions gametype headshots  kills longeststreak map matchid mode modename nearmisses playercount privatematch  seasonname team teamcount teamplacement teamsurvivaltime timeplayed uno username  }}
        """,
        variables
      )

    case body do
      %{data: %{vmatches: vmatches}} -> vmatches
      %{"data" => %{"vmatches" => vmatches}} -> vmatches
    end
  end
  def get_top_matches_executions!(uno, season, limit, mode, version \\ 1) do
    variables = %{"uno" => uno, "season" => season, "version" => version, "limit" => limit, "mode" => mode}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getTopMatchesAllModesOneSeason($uno: String!, $season: String!, $version: Int!, $limit: Int!, $mode: [String!]) {  vmatches(order_by: {utcstartseconds: desc},  where: { _and: [{uno: {_eq: $uno}},{ modename:{_in: $mode}} ,{seasonname: {_eq: $season}}, {exclude: {_eq: false}},{ dummy: {_lte: $version}}]}, limit: $limit) {  assists deaths downs executions gametype headshots  kills longeststreak map matchid mode modename nearmisses playercount privatematch  seasonname team teamcount teamplacement teamsurvivaltime timeplayed uno username  }}
        """,
        variables
      )

    case body do
      %{data: %{vmatches: vmatches}} -> vmatches
      %{"data" => %{"vmatches" => vmatches}} -> vmatches
    end
  end
  def get_top_matches_headshots!(uno, season, limit, mode, version \\ 1) do
    variables = %{"uno" => uno, "season" => season, "version" => version, "limit" => limit, "mode" => mode}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getTopMatchesAllModesOneSeason($uno: String!, $season: String!, $version: Int!, $limit: Int!, $mode: [String!]) {  vmatches(order_by: {utcstartseconds: desc},  where: { _and: [{uno: {_eq: $uno}},{ modename:{_in: $mode}} ,{seasonname: {_eq: $season}}, {exclude: {_eq: false}},{ dummy: {_lte: $version}}]}, limit: $limit) {  assists deaths downs executions gametype headshots  kills longeststreak map matchid mode modename nearmisses playercount privatematch  seasonname team teamcount teamplacement teamsurvivaltime timeplayed uno username  }}
        """,
        variables
      )

    case body do
      %{data: %{vmatches: vmatches}} -> vmatches
      %{"data" => %{"vmatches" => vmatches}} -> vmatches
    end
  end
  def get_top_matches_longeststreak!(uno, season, limit, mode, version \\ 1) do
    variables = %{"uno" => uno, "season" => season, "version" => version, "limit" => limit, "mode" => mode}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getTopMatchesAllModesOneSeason($uno: String!, $season: String!, $version: Int!, $limit: Int!, $mode: [String!]) {  vmatches(order_by: {utcstartseconds: desc},  where: { _and: [{uno: {_eq: $uno}},{ modename:{_in: $mode}} ,{seasonname: {_eq: $season}}, {exclude: {_eq: false}},{ dummy: {_lte: $version}}]}, limit: $limit) {  assists deaths downs executions gametype headshots  kills longeststreak map matchid mode modename nearmisses playercount privatematch  seasonname team teamcount teamplacement teamsurvivaltime timeplayed uno username  }}
        """,
        variables
      )

    case body do
      %{data: %{vmatches: vmatches}} -> vmatches
      %{"data" => %{"vmatches" => vmatches}} -> vmatches
    end
  end
  def get_top_matches_contracts!(uno, season, limit, mode, version \\ 1) do
    variables = %{"uno" => uno, "season" => season, "version" => version, "limit" => limit, "mode" => mode}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getTopMatchesAllModesOneSeason($uno: String!, $season: String!, $version: Int!, $limit: Int!, $mode: [String!]) {  vmatches(order_by: {utcstartseconds: desc},  where: { _and: [{uno: {_eq: $uno}},{ modename:{_in: $mode}} ,{seasonname: {_eq: $season}}, {exclude: {_eq: false}},{ dummy: {_lte: $version}}]}, limit: $limit) {  missionscomplete map matchid mode modename nearmisses playercount privatematch  seasonname team teamcount teamplacement teamsurvivaltime timeplayed uno username  }}
        """,
        variables
      )

    case body do
      %{data: %{vmatches: vmatches}} -> vmatches
      %{"data" => %{"vmatches" => vmatches}} -> vmatches
    end
  end
  def get_top_matches_teamwiped!(uno, season, limit, mode, version \\ 1) do
    variables = %{"uno" => uno, "season" => season, "version" => version, "limit" => limit, "mode" => mode}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getTopMatchesAllModesOneSeason($uno: String!, $season: String!, $version: Int!, $limit: Int!, $mode: [String!]) {  vmatches(order_by: {utcstartseconds: desc},  where: { _and: [{uno: {_eq: $uno}},{ modename:{_in: $mode}} ,{seasonname: {_eq: $season}}, {exclude: {_eq: false}},{ dummy: {_lte: $version}}]}, limit: $limit) {  assists deaths downs executions gametype headshots  kills longeststreak map matchid mode modename nearmisses playercount  objectiveteamwiped privatematch  seasonname team teamcount teamplacement teamsurvivaltime timeplayed uno username  }}
        """,
        variables
      )

    case body do
      %{data: %{vmatches: vmatches}} -> vmatches
      %{"data" => %{"vmatches" => vmatches}} -> vmatches
    end
  end

  def get_gulag!(uno, season, version \\ 1) do
    variables = %{"uno" => uno, "season" => season, "version" => version}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getAggGulagWeaponsAllModesOneSeason($uno: String!, $season: String!, $version: Int!) {  agggulagweaponsallmodesoneseason(order_by: {totalgulaggames: desc}, where: {uno: {_eq: $uno}, seasonname: {_eq: $season}, dummy: {_lte: $version}}) {    gulagweaponnames    totalgulaggames    totalgulagwins    totalgulaglosses    gulagwinpct    __typename  }}
        """,
        variables
      )

    case body do
      %{data: %{agggulagweaponsallmodesoneseason: data}} -> data
      %{"data" => %{"agggulagweaponsallmodesoneseason" => data}} -> data
    end
  end

  def get_matches!(uno, season, version, limit) do
    variables = %{"uno" => uno, "season" => season, "version" => version, "limit" => limit}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getMatches($uno: String!, $version: Int!, $limit: Int!, $season: String!) {  vmatches(order_by: {utcstartseconds: desc}, where: {uno: {_eq: $uno}, seasonname: {_eq: $season}, dummy: {_lte: $version}}, limit: $limit) { assists clantag damagedone damagetaken deaths distancetraveled downs dummy exclude executions gametype gulag gulagdeaths gulagkills headshots iscurrent isuser kills longeststreak map matchid missionscomplete mode modename nearmisses objectivebrcacheopen objectivebrkioskbuy objectivebrmissionpickuptablet objectivelaststandkill objectivereviver objectiveteamwiped percenttimemoving playercount privatematch score seasonname team teamcount teamplacement teamsurvivaltime timeplayed totalxp uno username utcendseconds utcstartseconds wallbangs } }
        """,
        variables
      )

    %{"data" => %{"vmatches" => vmatches}} = body
    vmatches
  end

  def get_by_match_id!(matchid) do
    variables = %{"matchid" => matchid}
    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
        query getMatch($matchid: String!) {  vmatches(order_by: {utcstartseconds: desc}, where: {matchid: {_eq: $matchid}}) { assists clantag damagedone damagetaken deaths distancetraveled downs dummy exclude executions gametype gulag gulagdeaths gulagkills headshots iscurrent isuser kills longeststreak map matchid missionscomplete mode modename nearmisses objectivebrcacheopen objectivebrkioskbuy objectivebrmissionpickuptablet objectivelaststandkill objectivereviver objectiveteamwiped percenttimemoving playercount privatematch score seasonname team teamcount teamplacement teamsurvivaltime timeplayed totalxp uno username utcendseconds utcstartseconds wallbangs}}
        """,
        variables
      )

    %{"data" => %{"vmatches" => vmatches}} = body
    vmatches
  end

  def get_squad_not_rebirth!(uno, season, version \\ 1) do
    variables = %{"uno" => uno, "season" => season, "version" => version}

    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
          query getAggSquadsAllModesOneSeason($uno: String!, $season: String!, $version: Int!)
        {  aggsquadsallmodesoneseason(order_by: {totalgames: desc}, where: {uno: {_eq: $uno}, seasonname: {_eq: $season}, dummy: {_lte: $version}}){
          unosquad
          usernamesquad
          totalgames
          totalwins
          winpct
          avgkills
          avgkillssquad
          avgdeaths
          avgdeathssquad
          avgkd
          avgkdsquad
          avgdamagedone
          avgdamagedonesquad
          avgdamagetaken
          avgdamagetakensquad
          avgscore
          avgscoresquad
          gulagwinpct
          gulagwinpctsquad
          headshotpct
          headshotpctsquad
          avgassists
          avgassistssquad
          avgpercenttimemoving
          avgpercenttimemovingsquad
          avgmissionscomplete
          avgmissionscompletesquad
          avgobjectiveteamwiped
          avgobjectiveteamwipedsquad
          avgobjectivereviver
          avgobjectivereviversquad
          avgobjectivebrkioskbuy
          avgobjectivebrkioskbuysquad
          avgobjectivebrcacheopen
          avgobjectivebrcacheopensquad
          isuser
        __typename  }}
        """,
        variables
      )

    body
  end

  def get_squad_rebirth!(
        uno,
        season,
        mode \\ "Rebirth: Resurgence",
        version \\ 1
      ) do
    variables = %{"uno" => uno, "mode" => mode, "season" => season, "version" => version}

    neuron_config()

    {:ok, %Neuron.Response{body: body}} =
      Neuron.query(
        """
          query getAggSquadsOneModeOneSeason($uno: String!, $mode: String!, $season: String!, $version: Int!) {  aggsquadsonemodeoneseason(order_by: {totalgames: desc}, where: {uno: {_eq: $uno}, seasonname: {_eq: $season}, modename: {_eq: $mode}, dummy: {_lte: $version}}) {
          unosquad
          usernamesquad
          totalgames
          totalwins
          winpct
          avgkills    avgkillssquad
          avgdeaths
          avgdeathssquad
          avgkd
          avgkdsquad
          avgdamagedone
          avgdamagedonesquad
          avgdamagetaken
          avgdamagetakensquad
          avgscore
          avgscoresquad
          gulagwinpct
          gulagwinpctsquad
          headshotpct
          headshotpctsquad
          avgassists
          avgassistssquad
          avgpercenttimemoving
          avgpercenttimemovingsquad
          avgmissionscomplete
          avgmissionscompletesquad
          avgobjectiveteamwiped
          avgobjectiveteamwipedsquad
          avgobjectivereviver
          avgobjectivereviversquad
          avgobjectivebrkioskbuy
          avgobjectivebrkioskbuysquad
          avgobjectivebrcacheopen
          avgobjectivebrcacheopensquad
          isuser
        __typename  }}
        """,
        variables
      )

    body
  end
end
