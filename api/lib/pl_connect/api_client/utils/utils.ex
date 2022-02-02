defmodule PlConnect.ApiClient.Utils do
  @moduledoc """
  Utilities for connecting api data and application data
  """

  alias PlConnect.Cod.Feature
  alias PlConnect.Cod.PlayerMatch

  require Ash.Query

  defp is_valid_record(record) do
    segment = record["segments"] |> Enum.at(0)
    metadata = segment["metadata"]
    teammates = metadata["teammates"]
    is_nil(teammates)
  end

  def get_user_platform_username(user, platform) do
    case platform do
      platform when platform in ["psn", :psn] -> user.psn_platform_username
      platform when platform in ["xbl", :xbl] -> user.xbl_platform_username
      platform when platform in ["battlenet", :battlenet] -> user.battlenet_platform_username
    end
  end

  def response_to_insert_record(matches, user_id, username, platform) do
    Enum.flat_map(matches, fn record ->
      segment = record["segments"] |> Enum.at(0)
      # skip the match that doesnt have the information to find on bet resolution
      if is_valid_record(record) do
        []
      else
        metadata = record["metadata"]
        match_mode = metadata["modeName"]

        match_mode =
          if is_binary(match_mode) do
            match_mode = match_mode
              |> String.downcase()
              |> String.split(" ")
            case match_mode do
              ["br_br_quads"] -> ["br", "quads"]
              match_mode when length(match_mode) > 1 -> match_mode
              _ -> ["unknown", "unknown"]
            end
          else
            ["unknown", "unknown"]
          end

        match_teamcomp =
          match_mode
          |> List.last()

        match_type =
          match_mode
          |> Enum.reverse()
          |> tl()
          |> Enum.reverse()
          |> Enum.join(" ")

        match_teamcomp =
          if match_teamcomp in ["duos", "quads", "trios"] do
            match_teamcomp
          else
            "unknown"
          end

        br_match_keys = Feature.get_feature_flag(:br_keys)
        plunder_match_keys = Feature.get_feature_flag(:plunder_keys)
        resurgence_match_keys = Feature.get_feature_flag(:resurgence_keys)

        match_type = [br: br_match_keys.value, plunder: plunder_match_keys.value, resurgence: resurgence_match_keys.value]
          |> Enum.reduce(nil, fn
            {key, values}, nil -> if String.split(values, ",") |> Enum.member?(match_type), do: key, else: nil
            _, acc -> acc
          end)
          |> to_string()

        kills =
          if is_number(segment["stats"]["kills"]["value"]) do
            trunc(segment["stats"]["kills"]["value"])
          else
            nil
          end

        placement =
          if is_number(segment["stats"]["placement"]["value"]) do
            trunc(segment["stats"]["placement"]["value"])
          else
            nil
          end

        damage =
          if is_number(segment["stats"]["damageDone"]["value"]) do
            trunc(segment["stats"]["damageDone"]["value"])
          else
            nil
          end

        match_map = metadata["mapName"]

        match_map =
          if is_binary(match_map) do
            match_map |> String.downcase() |> String.replace(" ", "_")
          else
            nil
          end

        match_map = case match_map do
          "mp_wz_island" -> "caldera"
          "caldera" when match_type == "resurgence" -> "rebirth_island"
          match_map when match_map in ["verdansk", "rebirth_island", "caldera"] -> match_map
          _ -> "unknown"
        end

        [
          %{
            match_cod_id: record["attributes"]["id"] |> String.to_integer(),
            platform_username: username,
            platform: platform,
            match_map: match_map,
            match_type: match_type,
            match_teamcomp: match_teamcomp,
            match_date: metadata["timestamp"],
            kills: kills,
            damage: damage,
            placement: placement,
            json_response: record,
            user_id: user_id
          }
        ]
      end
    end)
  end

  def create_user_match_attrs(input, user_id) when is_list(input),
    do: Enum.map(input, &create_user_match_attrs(&1, user_id))

  def create_user_match_attrs(input, user_id) do
    changeset = Ash.Changeset.for_create(PlayerMatch, :create, input)

    if changeset.valid? do
      Map.put(changeset.attributes, :user_id, user_id)
    else
      raise "Invalid Changes #{inspect(changeset)}"
    end
  end

  def get_user_matches_count!(user_id) do
    PlConnect.Cod.User
    |> Ash.Query.filter(id: user_id)
    |> Ash.Query.load([:matches_count])
    |> Ash.Query.select([:matches_count])
    |> PlConnect.Api.read_one!()
  end
end
