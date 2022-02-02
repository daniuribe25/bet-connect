defmodule PlConnect.ApiClient.WzRankedTest do
  use PlConnect.DataCase

  alias PlConnect.ApiClient.WzRanked

  import Mock

  setup do
    url = "https://codstats.hasura.app/v1/graphql"
    Neuron.Config.set(nil)
    Neuron.Config.set(url: url)
    %{url: url}
  end

  test "WzRanked.get_uno_wzranked!/2" do
    uno_id = "822908597059913425"

    with_mock PlConnect.Neuron.Connection,
      call: fn _body, _options ->
        {:ok,
         %Neuron.Response{
           body: %{"data" => %{"searchUser" => %{"__typename" => "User", "uno" => "#{uno_id}"}}},
           status_code: 200,
           headers: []
         }}
      end do
      assert uno = WzRanked.get_uno_wzranked!("PLZach", "psn")
      assert uno == uno_id
    end
  end

  test "WzRanked.get_matches!/3 limit 0" do
    uno_id = "822908597059913425"

    with_mock PlConnect.Neuron.Connection,
      call: fn _body, _options ->
        {:ok,
         %Neuron.Response{
           body: %{
             "data" => %{
               "vmatches" => []
             }
           },
           status_code: 200,
           headers: []
         }}
      end do
      assert vmatches = WzRanked.get_matches!(uno_id, "season_test", 1, 0)

      assert length(vmatches) == 0
    end
  end

  test "WzRanked.get_matches!/3 limit 2" do
    uno_id = "5238108191898297863"
    current_version = 1

    with_mock PlConnect.Neuron.Connection,
      call: fn _body, _options ->
        {:ok,
         %Neuron.Response{
           body: %{
             "data" => %{
               "vmatches" => [
                 %{
                   "__typename" => "vmatches",
                   "assists" => 0,
                   "damagedone" => 40,
                   "damagetaken" => 100,
                   "deaths" => 1,
                   "downs" => 0,
                   "gulag" => nil,
                   "headshots" => 0,
                   "isuser" => true,
                   "kills" => 0,
                   "matchid" => "18163361839369486895",
                   "missionscomplete" => 0,
                   "modename" => "Duos",
                   "objectiveteamwiped" => 0,
                   "percenttimemoving" => 91,
                   "score" => 200,
                   "teamplacement" => 72,
                   "username" => "Stimblack",
                   "utcstartseconds" => 1_628_135_890
                 },
                 %{
                   "__typename" => "vmatches",
                   "assists" => 1,
                   "damagedone" => 455,
                   "damagetaken" => 664,
                   "deaths" => 3,
                   "downs" => 0,
                   "gulag" => "W",
                   "headshots" => 0,
                   "isuser" => true,
                   "kills" => 1,
                   "matchid" => "14647315356205826671",
                   "missionscomplete" => 1,
                   "modename" => "Duos",
                   "objectiveteamwiped" => 0,
                   "percenttimemoving" => 73,
                   "score" => 1975,
                   "teamplacement" => 18,
                   "username" => "Stimblack",
                   "utcstartseconds" => 1_628_134_751
                 }
               ]
             }
           },
           status_code: 200,
           headers: []
         }}
      end do
      assert vmatches = WzRanked.get_matches!(uno_id, "season_test", current_version, 2)
      assert length(vmatches) == 2
    end
  end

  test "WzRanked.get_by_match_id!/1" do
    matchId = "14647315356205826671"
    vmatches = WzRanked.get_by_match_id!(matchId)

    assert length(vmatches) == 150
  end

  test "WzRanked.get_summary_by_season!/3" do
    uno_id = "5238108191898297863"
    current_version = 1
    current_season = "Season Four (CW)"

    with_mock PlConnect.Neuron.Connection,
      call: fn _body, _options ->
        {:ok,
         %Neuron.Response{
           body: %{
             "data" => %{
               "aggmodesoneseason" => [
                 %{
                   "__typename" => "aggmodesoneseason",
                   "avgkd" => 1.23,
                   "avgkills" => 3.02,
                   "exclude" => true,
                   "gulagwinpct" => nil,
                   "headshotpct" => 21.4,
                   "maxkills" => 14,
                   "mode" => "Rebirth: Resurgence",
                   "placementpct" => 61.1,
                   "recordkills" => 12,
                   "totalgames" => 399,
                   "totalwins" => 77,
                   "winpct" => 19.3
                 },
                 %{
                   "__typename" => "aggmodesoneseason",
                   "avgkd" => 0.68,
                   "avgkills" => 1.32,
                   "exclude" => false,
                   "gulagwinpct" => 60.0,
                   "headshotpct" => 28.0,
                   "maxkills" => 4,
                   "mode" => "Trios",
                   "placementpct" => 81.0,
                   "recordkills" => 0,
                   "totalgames" => 19,
                   "totalwins" => 0,
                   "winpct" => 0.0
                 },
                 %{
                   "__typename" => "aggmodesoneseason",
                   "avgkd" => 1.27,
                   "avgkills" => 2.63,
                   "exclude" => false,
                   "gulagwinpct" => 50.0,
                   "headshotpct" => 23.8,
                   "maxkills" => 11,
                   "mode" => "Quads",
                   "placementpct" => 75.0,
                   "recordkills" => 4,
                   "totalgames" => 16,
                   "totalwins" => 1,
                   "winpct" => 6.3
                 },
                 %{
                   "__typename" => "aggmodesoneseason",
                   "avgkd" => nil,
                   "avgkills" => 0.0,
                   "exclude" => true,
                   "gulagwinpct" => nil,
                   "headshotpct" => nil,
                   "maxkills" => 0,
                   "mode" => "BR Buy Back",
                   "placementpct" => 131.7,
                   "recordkills" => 0,
                   "totalgames" => 1,
                   "totalwins" => 0,
                   "winpct" => 0.0
                 },
                 %{
                   "__typename" => "aggmodesoneseason",
                   "avgkd" => 1.5,
                   "avgkills" => 3.0,
                   "exclude" => false,
                   "gulagwinpct" => 100.0,
                   "headshotpct" => 33.3,
                   "maxkills" => 3,
                   "mode" => "Duos",
                   "placementpct" => 62.8,
                   "recordkills" => 0,
                   "totalgames" => 1,
                   "totalwins" => 0,
                   "winpct" => 0.0
                 }
               ]
             }
           },
           status_code: 200,
           headers: []
         }}
      end do
      assert aggmodesoneseason = WzRanked.get_summary_by_season!(uno_id, current_season, current_version)

      assert length(aggmodesoneseason) == 5
      [first_element | _] = aggmodesoneseason
      assert first_element["avgkills"] == 3.02
    end
  end

  test "WzRanked.get_squad_not_rebirth!/3" do
    uno_id = "5238108191898297863"
    current_version = 1
    current_season = "Season Four (CW)"

    with_mock PlConnect.Neuron.Connection,
      call: fn _body, _options ->
        {:ok,
         %Neuron.Response{
           body: %{
             "data" => %{
               "aggsquadsallmodesoneseason" => [
                 %{
                   "avgdamagedone" => 819,
                   "avgdamagetaken" => 525,
                   "gulagwinpct" => 47.4,
                   "avgpercenttimemoving" => 72,
                   "avgdeaths" => 2.18,
                   "avgkd" => 0.81,
                   "avgmissionscompletesquad" => 0.5,
                   "avgassistssquad" => 1.0,
                   "avgobjectivebrcacheopen" => 2.32,
                   "avgdamagetakensquad" => 463,
                   "headshotpct" => 25.6,
                   "avgkdsquad" => 2.27,
                   "avgpercenttimemovingsquad" => 77,
                   "avgobjectivebrcacheopensquad" => 5.45,
                   "avgobjectivebrkioskbuysquad" => 1.77,
                   "avgkills" => 1.77,
                   "avgobjectiveteamwipedsquad" => 0.55,
                   "headshotpctsquad" => 26.9,
                   "avgobjectivereviversquad" => 0.32,
                   "avgobjectivebrkioskbuy" => 0.73,
                   "avgassists" => 0.73,
                   "avgobjectiveteamwiped" => 0.41,
                   "avgmissionscomplete" => 0.23,
                   "totalgames" => 22,
                   "avgkillssquad" => 4.23,
                   "avgdeathssquad" => 1.86,
                   "avgdamagedonesquad" => 1627,
                   "__typename" => "aggsquadsallmodesoneseason",
                   "avgobjectivereviver" => 0.23,
                   "unosquad" => "2340480489952989773",
                   "avgscore" => 2026,
                   "isuser" => true,
                   "usernamesquad" => "wooldynasty",
                   "gulagwinpctsquad" => 73.7,
                   "winpct" => 4.5,
                   "avgscoresquad" => 4005,
                   "totalwins" => 1
                 },
                 %{
                   "avgdamagedone" => 855,
                   "avgdamagetaken" => 487,
                   "gulagwinpct" => 43.8,
                   "avgpercenttimemoving" => 66,
                   "avgdeaths" => 2.05,
                   "avgkd" => 0.9,
                   "avgmissionscompletesquad" => 0.1,
                   "avgassistssquad" => 0.75,
                   "avgobjectivebrcacheopen" => 2.3,
                   "avgdamagetakensquad" => 459,
                   "headshotpct" => 21.6,
                   "avgkdsquad" => 0.59,
                   "avgpercenttimemovingsquad" => 65,
                   "avgobjectivebrcacheopensquad" => 2.4,
                   "avgobjectivebrkioskbuysquad" => 0.7,
                   "avgkills" => 1.85,
                   "avgobjectiveteamwipedsquad" => 0.15,
                   "headshotpctsquad" => 16.7,
                   "avgobjectivereviversquad" => 0.2,
                   "avgobjectivebrkioskbuy" => 0.65,
                   "avgassists" => 0.8,
                   "avgobjectiveteamwiped" => 0.45,
                   "avgmissionscomplete" => 0.2,
                   "totalgames" => 20,
                   "avgkillssquad" => 1.2,
                   "avgdeathssquad" => 2.05,
                   "avgdamagedonesquad" => 588,
                   "__typename" => "aggsquadsallmodesoneseason",
                   "avgobjectivereviver" => 0.3,
                   "unosquad" => "8913889064297650795",
                   "avgscore" => 1950,
                   "isuser" => true,
                   "usernamesquad" => "MamasClunker",
                   "gulagwinpctsquad" => 64.7,
                   "winpct" => 5.0,
                   "avgscoresquad" => 1496,
                   "totalwins" => 1
                 }
               ]
             }
           },
           status_code: 200,
           headers: []
         }}
      end do
      assert %{"data" => data} =
               WzRanked.get_squad_not_rebirth!(uno_id, current_season, current_version)

      assert %{"aggsquadsallmodesoneseason" => aggsquadsallmodesoneseason} = data
      assert length(aggsquadsallmodesoneseason) == 2
      [first_element | _] = aggsquadsallmodesoneseason
      assert first_element["gulagwinpct"] == 47.4
    end
  end

  test "WzRanked.get_squad_rebirth!/4" do
    uno_id = "5238108191898297863"
    current_version = 1
    current_season = "Season Four (CW)"
    current_mode = "Rebirth: Resurgence"

    with_mock PlConnect.Neuron.Connection,
      call: fn _body, _options ->
        {:ok,
         %Neuron.Response{
           body: %{
            "data" => %{
              "aggsquadsonemodeoneseason" => [
                %{
                  "avgdamagedone" => 1473,
                  "avgdamagetaken" => 767,
                  "gulagwinpct" => nil,
                  "avgpercenttimemoving" => 80,
                  "avgdeaths" => 2.39,
                  "avgkd" => 1.27,
                  "avgmissionscompletesquad" => 0.21,
                  "avgassistssquad" => 1.72,
                  "avgobjectivebrcacheopen" => 2.34,
                  "avgdamagetakensquad" => 731,
                  "headshotpct" => 21.5,
                  "avgkdsquad" => 1.14,
                  "avgpercenttimemovingsquad" => 80,
                  "avgobjectivebrcacheopensquad" => 2.27,
                  "avgobjectivebrkioskbuysquad" => 0.93,
                  "avgkills" => 3.02,
                  "avgobjectiveteamwipedsquad" => 0.32,
                  "headshotpctsquad" => 16.5,
                  "avgobjectivereviversquad" => 0.49,
                  "avgobjectivebrkioskbuy" => 1.23,
                  "avgassists" => 1.63,
                  "avgobjectiveteamwiped" => 0.28,
                  "avgmissionscomplete" => 0.2,
                  "totalgames" => 219,
                  "avgkillssquad" => 2.68,
                  "avgdeathssquad" => 2.37,
                  "avgdamagedonesquad" => 1366,
                  "__typename" => "aggsquadsonemodeoneseason",
                  "avgobjectivereviver" => 0.48,
                  "unosquad" => "12062018376979115839",
                  "avgscore" => 2687,
                  "isuser" => true,
                  "usernamesquad" => "nbh504",
                  "gulagwinpctsquad" => nil,
                  "winpct" => 21.5,
                  "avgscoresquad" => 2308,
                  "totalwins" => 47
                },
                %{
                  "avgdamagedone" => 1570,
                  "avgdamagetaken" => 744,
                  "gulagwinpct" => nil,
                  "avgpercenttimemoving" => 83,
                  "avgdeaths" => 2.31,
                  "avgkd" => 1.36,
                  "avgmissionscompletesquad" => 0.28,
                  "avgassistssquad" => 1.34,
                  "avgobjectivebrcacheopen" => 2.71,
                  "avgdamagetakensquad" => 611,
                  "headshotpct" => 20.3,
                  "avgkdsquad" => 2.16,
                  "avgpercenttimemovingsquad" => 85,
                  "avgobjectivebrcacheopensquad" => 3.1,
                  "avgobjectivebrkioskbuysquad" => 1.23,
                  "avgkills" => 3.14,
                  "avgobjectiveteamwipedsquad" => 0.45,
                  "headshotpctsquad" => 15.3,
                  "avgobjectivereviversquad" => 0.46,
                  "avgobjectivebrkioskbuy" => 1.54,
                  "avgassists" => 1.87,
                  "avgobjectiveteamwiped" => 0.32,
                  "avgmissionscomplete" => 0.3,
                  "totalgames" => 166,
                  "avgkillssquad" => 4.28,
                  "avgdeathssquad" => 1.98,
                  "avgdamagedonesquad" => 1879,
                  "__typename" => "aggsquadsonemodeoneseason",
                  "avgobjectivereviver" => 0.52,
                  "unosquad" => "18128187229966551133",
                  "avgscore" => 3192,
                  "isuser" => true,
                  "usernamesquad" => "KraftPunk",
                  "gulagwinpctsquad" => nil,
                  "winpct" => 27.7,
                  "avgscoresquad" => 3094,
                  "totalwins" => 46
                },
                %{
                  "avgdamagedone" => 1510,
                  "avgdamagetaken" => 744,
                  "gulagwinpct" => nil,
                  "avgpercenttimemoving" => 80,
                  "avgdeaths" => 2.35,
                  "avgkd" => 1.24,
                  "avgmissionscompletesquad" => 0.38,
                  "avgassistssquad" => 1.31,
                  "avgobjectivebrcacheopen" => 2.47,
                  "avgdamagetakensquad" => 762,
                  "headshotpct" => 21.9,
                  "avgkdsquad" => 0.82,
                  "avgpercenttimemovingsquad" => 79,
                  "avgobjectivebrcacheopensquad" => 2.22,
                  "avgobjectivebrkioskbuysquad" => 1.18,
                  "avgkills" => 2.91,
                  "avgobjectiveteamwipedsquad" => 0.15,
                  "headshotpctsquad" => 14.1,
                  "avgobjectivereviversquad" => 0.54,
                  "avgobjectivebrkioskbuy" => 1.28,
                  "avgassists" => 1.64,
                  "avgobjectiveteamwiped" => 0.21,
                  "avgmissionscomplete" => 0.23,
                  "totalgames" => 149,
                  "avgkillssquad" => 2.15,
                  "avgdeathssquad" => 2.63,
                  "avgdamagedonesquad" => 1057,
                  "__typename" => "aggsquadsonemodeoneseason",
                  "avgobjectivereviver" => 0.48,
                  "unosquad" => "2200910",
                  "avgscore" => 2798,
                  "isuser" => true,
                  "usernamesquad" => "WhoDat3",
                  "gulagwinpctsquad" => nil,
                  "winpct" => 15.4,
                  "avgscoresquad" => 2298,
                  "totalwins" => 23
                },
                %{
                  "avgdamagedone" => 1763,
                  "avgdamagetaken" => 831,
                  "gulagwinpct" => nil,
                  "avgpercenttimemoving" => 82,
                  "avgdeaths" => 2.77,
                  "avgkd" => 1.31,
                  "avgmissionscompletesquad" => 0.09,
                  "avgassistssquad" => 1.38,
                  "avgobjectivebrcacheopen" => 2.36,
                  "avgdamagetakensquad" => 791,
                  "headshotpct" => 20.5,
                  "avgkdsquad" => 0.62,
                  "avgpercenttimemovingsquad" => 82,
                  "avgobjectivebrcacheopensquad" => 2.7,
                  "avgobjectivebrkioskbuysquad" => 0.88,
                  "avgkills" => 3.64,
                  "avgobjectiveteamwipedsquad" => 0.11,
                  "headshotpctsquad" => 21.0,
                  "avgobjectivereviversquad" => 0.55,
                  "avgobjectivebrkioskbuy" => 0.95,
                  "avgassists" => 1.6,
                  "avgobjectiveteamwiped" => 0.26,
                  "avgmissionscomplete" => 0.28,
                  "totalgames" => 115,
                  "avgkillssquad" => 1.74,
                  "avgdeathssquad" => 2.8,
                  "avgdamagedonesquad" => 886,
                  "__typename" => "aggsquadsonemodeoneseason",
                  "avgobjectivereviver" => 0.57,
                  "unosquad" => "9481469311214709783",
                  "avgscore" => 2590,
                  "isuser" => true,
                  "usernamesquad" => "TheBriceIsRight",
                  "gulagwinpctsquad" => nil,
                  "winpct" => 13.9,
                  "avgscoresquad" => 2022,
                  "totalwins" => 16
                },
                %{
                  "avgdamagedone" => 1642,
                  "avgdamagetaken" => 820,
                  "gulagwinpct" => nil,
                  "avgpercenttimemoving" => 82,
                  "avgdeaths" => 2.62,
                  "avgkd" => 1.24,
                  "avgmissionscompletesquad" => 0.82,
                  "avgassistssquad" => 1.37,
                  "avgobjectivebrcacheopen" => 2.66,
                  "avgdamagetakensquad" => 803,
                  "headshotpct" => 19.9,
                  "avgkdsquad" => 1.24,
                  "avgpercenttimemovingsquad" => 80,
                  "avgobjectivebrcacheopensquad" => 5.19,
                  "avgobjectivebrkioskbuysquad" => 1.94,
                  "avgkills" => 3.26,
                  "avgobjectiveteamwipedsquad" => 0.32,
                  "headshotpctsquad" => 19.5,
                  "avgobjectivereviversquad" => 0.36,
                  "avgobjectivebrkioskbuy" => 1.61,
                  "avgassists" => 1.84,
                  "avgobjectiveteamwiped" => 0.32,
                  "avgmissionscomplete" => 0.3,
                  "totalgames" => 114,
                  "avgkillssquad" => 3.11,
                  "avgdeathssquad" => 2.5,
                  "avgdamagedonesquad" => 1526,
                  "__typename" => "aggsquadsonemodeoneseason",
                  "avgobjectivereviver" => 0.68,
                  "unosquad" => "25863786",
                  "avgscore" => 3190,
                  "isuser" => true,
                  "usernamesquad" => "LilManMilo",
                  "gulagwinpctsquad" => nil,
                  "winpct" => 21.1,
                  "avgscoresquad" => 3908,
                  "totalwins" => 24
                },
                %{
                  "avgdamagedone" => 1874,
                  "avgdamagetaken" => 961,
                  "gulagwinpct" => nil,
                  "avgpercenttimemoving" => 85,
                  "avgdeaths" => 2.93,
                  "avgkd" => 1.3,
                  "avgmissionscompletesquad" => 0.11,
                  "avgassistssquad" => 1.4,
                  "avgobjectivebrcacheopen" => 2.47,
                  "avgdamagetakensquad" => 913,
                  "headshotpct" => 26.3,
                  "avgkdsquad" => 1.09,
                  "avgpercenttimemovingsquad" => 85,
                  "avgobjectivebrcacheopensquad" => 2.58,
                  "avgobjectivebrkioskbuysquad" => 1.2,
                  "avgkills" => 3.8,
                  "avgobjectiveteamwipedsquad" => 0.2,
                  "headshotpctsquad" => 29.5,
                  "avgobjectivereviversquad" => 0.76,
                  "avgobjectivebrkioskbuy" => 1.33,
                  "avgassists" => 2.24,
                  "avgobjectiveteamwiped" => 0.31,
                  "avgmissionscomplete" => 0.24,
                  "totalgames" => 45,
                  "avgkillssquad" => 3.24,
                  "avgdeathssquad" => 2.98,
                  "avgdamagedonesquad" => 1565,
                  "__typename" => "aggsquadsonemodeoneseason",
                  "avgobjectivereviver" => 0.78,
                  "unosquad" => "12420164356451422036",
                  "avgscore" => 3155,
                  "isuser" => false,
                  "usernamesquad" => "Oew4",
                  "gulagwinpctsquad" => nil,
                  "winpct" => 15.6,
                  "avgscoresquad" => 2646,
                  "totalwins" => 7
                },
                %{
                  "avgdamagedone" => 1466,
                  "avgdamagetaken" => 790,
                  "gulagwinpct" => nil,
                  "avgpercenttimemoving" => 82,
                  "avgdeaths" => 2.86,
                  "avgkd" => 0.82,
                  "avgmissionscompletesquad" => 0.0,
                  "avgassistssquad" => 1.43,
                  "avgobjectivebrcacheopen" => 2.57,
                  "avgdamagetakensquad" => 671,
                  "headshotpct" => 21.2,
                  "avgkdsquad" => 0.87,
                  "avgpercenttimemovingsquad" => 83,
                  "avgobjectivebrcacheopensquad" => 1.71,
                  "avgobjectivebrkioskbuysquad" => 1.29,
                  "avgkills" => 2.36,
                  "avgobjectiveteamwipedsquad" => 0.07,
                  "headshotpctsquad" => 22.2,
                  "avgobjectivereviversquad" => 0.5,
                  "avgobjectivebrkioskbuy" => 1.5,
                  "avgassists" => 1.57,
                  "avgobjectiveteamwiped" => 0.14,
                  "avgmissionscomplete" => 0.64,
                  "totalgames" => 14,
                  "avgkillssquad" => 1.93,
                  "avgdeathssquad" => 2.21,
                  "avgdamagedonesquad" => 1110,
                  "__typename" => "aggsquadsonemodeoneseason",
                  "avgobjectivereviver" => 0.86,
                  "unosquad" => "8913889064297650795",
                  "avgscore" => 3264,
                  "isuser" => true,
                  "usernamesquad" => "MamasClunker",
                  "gulagwinpctsquad" => nil,
                  "winpct" => 21.4,
                  "avgscoresquad" => 2305,
                  "totalwins" => 3
                }
              ]
            }
          },
           status_code: 200,
           headers: []
         }}
      end do
      assert %{"data" => data} =
               WzRanked.get_squad_rebirth!(uno_id, current_mode, current_season, current_version)

      assert %{"aggsquadsonemodeoneseason" => aggsquadsonemodeoneseason} = data
      assert length(aggsquadsonemodeoneseason) == 7
      [first_element | _] = aggsquadsonemodeoneseason
      assert first_element["totalwins"] == 47
    end
  end
end
