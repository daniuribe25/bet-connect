defmodule PlConnect.TestHelpers do

  import PlConnect.Factory
  import ExUnit.Assertions

  alias PlConnect.Api
  alias PlConnect.Repo
  alias PlConnect.ApiClient.Utils
  alias PlConnect.Cod.Team
  alias PlConnect.Cod.Team.Embedded.Probabilities
  alias PlConnect.Cod.PlayerMatch
  alias PlConnect.Cod.UserBetHistory

  def assert_fields(map1, map2, fields \\ []) do
    Enum.each(fields, fn field ->
      assert Map.get(map1, field) == Map.get(map2, field)
    end)
  end

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
    categories = [:rookie, :legend, :diamond]
    types = [:main, :kills, :placement, :damage, :match]

    Enum.each(categories, fn cat ->
      Enum.each(types, fn t ->
        multiplier = case cat do
          :rookie -> 1
          :legend -> 2
          :diamond -> 3
        end
        goal = case t do
          :main -> 4 * multiplier
          :kills -> 5 * multiplier
          :placement -> 9 / multiplier |> Float.ceil() |> trunc()
          :match -> 12 / multiplier |> Float.ceil() |> trunc()
          :damage -> 400 * multiplier
        end
        [2, 4, 6]
        |> Enum.with_index()
        |> Enum.each(fn {extra, index} ->
          {:ok, _} = Api.create_bet_values(%{
            level: index,
            goal: goal,
            payout: 4 + extra,
            min_kda: 0.1,
            max_kda: 3.0,
            game_mode: :verdansk,
            bet_category: cat,
            type: t
          })
          {:ok, _} = Api.create_bet_values(%{
            level: index,
            goal: goal,
            payout: 4 + extra,
            min_kda: 0.1,
            max_kda: 3.0,
            game_mode: :rebirth_island,
            bet_category: cat,
            type: t
          })
        end)
      end)
    end)

    Enum.each(categories, fn cat ->
      vals = Api.get_bet_values!(:verdansk, cat, 1.33)
      assert length(vals) == 15
    end)
  end

  def create_players(count, balance \\ 100, extra \\ 0.0) do
    1..count |> Enum.to_list() |> Enum.map(fn _ -> create_user(balance, extra) end)
  end

  def create_user(balance \\ 100, extra \\ 1.0) do
    params = params_for(:user)

    platform_key = [:xbl_platform_username, :psn_platform_username, :battlenet_platform_username]
      |> Enum.random()
    platform = Map.get(params, platform_key)

    user = %{
      password: "password_example",
      password_confirmation: "password_example",
      email: params.email,
      phone: params.phone,
    }
    |> Map.put(platform_key, platform)
    |> Api.create_user_platform_bypass!()

    Api.create_rebirth_line(%{
      mean_kills_sum: 1,
      advantage: :player,
      team_size: :duos,
      kills_bet_1: 1,
      kills_bet_2: 2,
      kills_bet_3: 3,
      payout_bet_1: 1,
      payout_bet_2: 2,
      payout_bet_3: 3
    })

    user
    |> Api.approve_account!()
    |> Api.update_user_wallet!(%{wallet: %{funds: balance}})
    |> Api.update_user_difficulty_value!(:main, Float.ceil(extra))
    |> Api.update_user_difficulty_value!(:kills, Float.ceil(extra))
    |> Api.update_user_difficulty_value!(:placement, Float.ceil(extra))
    |> Api.update_user_difficulty_value!(:damage, extra)
    |> Api.update_user_difficulty_value!(:match, extra)
  end

  def create_team(users, bet_format \\ :legend, match_map \\ :verdansk, squad_size \\ nil) do
    [leader | rest] = users
    users_lobby = Enum.map(rest, &(%{user_id: &1.id, status: :pending}))
      |> (&([%{user_id: leader.id, status: :joined}] ++ &1)).()

    params_for(:invite_lobby)
    |> Map.put(:leader_id, leader.id)
    |> Map.put(:users, users_lobby)
    |> Api.create_lobby()

    squad_size = if is_nil(squad_size), do: length(users), else: squad_size

    users = Enum.map(users, &%{user_id: &1.id, lobby_platform: "psn"})
    Api.create_team!(users, bet_format, match_map, squad_size, actor: leader)
    |> Api.load!([:difficulty, :probabilities_calculated])
  end

  @lines [:main, :kills, :placement]

  def create_bet(%Team{id: id, probabilities: %Probabilities{bet_category: bet_category}}, lines \\ @lines) do
    levels = Enum.reduce(lines, [], fn line, acc ->
      acc ++ [%{type: line, level: 1}]
    end)

    params = params_for(:user_bet_history)
      |> Map.put(:bet_format, bet_category)
      |> Map.put(:user_bets_level_result, levels)
    Api.create_bet!(id, params)
  end

  @match_info %{
    noob: %{
      kills: 2,
      damageDone: 200,
      deaths: 6,
      placement: 30,
      assists: 3,
      gulagKills: 0.0,
      gulagDeaths: 1.0,
      kdRatio: 0.4,
      timePlayed: 237
    },
    rookie: %{
      kills: 10,
      damageDone: 400,
      deaths: 3,
      placement: 5,
      assists: 3,
      gulagKills: 0.0,
      gulagDeaths: 1.0,
      kdRatio: 0.7,
      timePlayed: 389
    },
    legend: %{
      kills: 16,
      damageDone: 600,
      deaths: 7,
      placement: 3,
      assists: 7,
      gulagKills: 1.0,
      gulagDeaths: 0.0,
      kdRatio: 1.7,
      timePlayed: 526
    },
    diamond: %{
      kills: 22,
      damageDone: 1000,
      deaths: 5,
      placement: 1,
      assists: 15,
      gulagKills: 0.0,
      gulagDeaths: 0.0,
      kdRatio: 2.1,
      timePlayed: 826
    }
  }

  def insert_matches(users, %UserBetHistory{inserted_at: date, map: map} = bet, bet_format \\ nil, custom_id \\ nil) do
    teamcomp = case length(users) do
      4 -> "Quads"
      3 -> "Trios"
      2 -> "Duos"
      _ -> "Solos"
    end
    {mode_name, map} = case map do
      :verdansk -> {"BR #{teamcomp}", "Verdansk"}
      :rebirth_island -> {"Resurgence #{teamcomp}", "Rebirth Island"}
      _ -> {"unknown", "unknown"}
    end
    params =
      params_for(:player_match).json_response
      |> put_in(["metadata", "timestamp"], DateTime.to_string(date))
      |> put_in(["metadata", "mapName"], map)
      |> put_in(["metadata", "modeName"], mode_name)
      |> (&(if is_nil(custom_id), do: &1, else: put_in(&1, ["attributes", "id"], "#{custom_id}"))).()

    bet_format = if is_nil(bet_format), do: bet.bet_format, else: bet_format
    info = Map.get(@match_info, bet_format)
    stats = Map.keys(info) |> Enum.map(&({&1, Map.get(info, &1)}))
      |> Enum.reduce(%{}, &(Map.put(&2, "#{elem(&1, 0)}", %{"value" => elem(&1, 1)})))

    teammates = Enum.map(users, fn user ->
      profile_key = PlConnect.Helpers.get_platform_field(user)
      %{"platformUserHandle" => Map.get(user, profile_key)}
    end)

    records =
      Enum.map(users, fn user ->
        {_, profile, platform, _} = PlConnect.Helpers.iterate_platforms(user)

        segment = %{
          "stats" => stats,
          "metadata" => %{
            "platformUserHandle" => profile,
            "teammates" =>
              Enum.filter(teammates, &(&1["platformUserHandle"] != profile))
          }
        }

        match = Map.put(params, "segments", [segment])

        [match]
        |> Utils.response_to_insert_record(user.id, profile, platform)
        |> Utils.create_user_match_attrs(user.id)
        |> Enum.at(0)
      end)

    {:ok, _} =
      Ecto.Multi.new()
      |> Ecto.Multi.insert_all(:insert_matches, PlayerMatch, records, on_conflict: :nothing)
      |> Repo.transaction()

    records
  end

  def insert_user_event_info(event) do
    Api.save_report_event(event)
  end

end
