defmodule PlConnect.Cod.ProbabilitiesCalculator do

  @rebirth_min_members Application.get_env(:pl_connect, :rebirth_min_members)
  @verdansk_min_members Application.get_env(:pl_connect, :verdansk_min_members)
  @caldera_min_members Application.get_env(:pl_connect, :caldera_min_members)

#  todo: transform this values to feature flags
  @default_kda 1.33
  @max_kda_rebirth String.to_float(Application.fetch_env!(:pl_connect, :max_kda_rebirth))
  @max_kda_verdansk String.to_float(Application.fetch_env!(:pl_connect, :max_kda_verdansk))
  @max_kda_caldera String.to_float(Application.fetch_env!(:pl_connect, :max_kda_caldera))

  @teamcomps [:solo, :duos, :trios, :quads]

  alias PlConnect.Api
  alias PlConnect.ApiClient.Utils
#  alias PlConnect.External.CodPlayPython

  def calculate_probabilities(players, game_mode, bet_category, squad_size) do
    min_num_players = case game_mode do
      :rebirth_island -> @rebirth_min_members
      :verdansk -> @verdansk_min_members
      :caldera -> @caldera_min_members
      _ -> @verdansk_min_members
    end

    cond do
      squad_size < min_num_players ->
        {:error, :min_num_players, min_num_players}
      true ->
        with _matches <- get_player_matches(players),
             {:ok, players_kda} <- get_users_kda(players) do
          {:ok, process_data(players_kda, game_mode, bet_category)}
        else
          error -> error
        end
      true ->
        {:error, :invalid_data}
    end
  end

  defp get_player_matches(players, map \\ "rebirth_island") do
    teamcomp = Enum.at(@teamcomps, length(players))

    players
    |> Enum.flat_map(fn player ->
      Api.get_user_matches!(player.user.id, map, teamcomp, player.lobby_platform)
    end)
    |> Enum.reject(fn x -> x.kills == nil or x.damage == nil or x.placement == nil end)
  end

  defp get_users_kda(players) do
    players
    |> Enum.reduce_while({:ok, %{}}, fn player, {:ok, acc} ->
      username = Utils.get_user_platform_username(player.user, player.lobby_platform)

      data =
        case player.lobby_platform do
          platform when platform in ["xbl", :xbl] -> player.user.xbl_cod_profile
          platform when platform in ["psn", :psn] -> player.user.psn_cod_profile
          platform when platform in ["battlenet", :battlenet] -> player.user.battlenet_cod_profile
        end

      {username, kda} = if is_nil(data) do
        {username, @default_kda}
      else
        {data.json["platformInfo"]["platformUserIdentifier"], data.kda_ratio}
      end
      {:cont, {:ok, Map.put(acc, username, kda)}}
    end)
  end

  defp process_data(players_kda, game_mode, bet_category) do
    kda = Enum.sum(Map.values(players_kda)) / length(Map.values(players_kda))

    kda_allowed = case game_mode do
      :rebirth_island -> kda < @max_kda_rebirth
      :verdansk -> kda < @max_kda_verdansk
      :caldera -> kda < @max_kda_caldera
      _ -> kda < @max_kda_verdansk
    end

    mode = case game_mode do
      :caldera -> :verdansk
      game_mode -> game_mode
    end

    if kda_allowed do
      bet_lines = Api.get_bet_values!(mode, bet_category, kda)
        |> Enum.reduce(
          %{},
          fn value, results ->
            line = Map.take(value, [:level, :goal, :payout])
            values = Map.get(results, value.type, [])
            Map.put(results, value.type, values ++ [line])
          end
        )

      %PlConnect.Cod.Team.Embedded.Probabilities{
        game_mode: game_mode,
        bet_category: bet_category,
        bet_lines: struct!(PlConnect.Cod.Team.Embedded.BetLine, bet_lines)
      }
    else
      {:error, :max_kda}
    end
  end

end
