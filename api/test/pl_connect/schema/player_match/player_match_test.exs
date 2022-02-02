defmodule PlConnect.Cod.PlayerMatch.PlayerMatchTest do
  use PlConnect.DataCase

  import PlConnect.TestHelpers

  alias PlConnect.Api
  alias PlConnect.Cod.PlayerMatch

  defp assert_player_match(%PlayerMatch{} = pm1, %PlayerMatch{} = pm2) do
    assert pm1.match_cod_id == pm2.match_cod_id
    assert pm1.platform_username == pm2.platform_username
    assert pm1.match_map == pm2.match_map
    assert pm1.match_type == pm2.match_type
  end

  #  test "list_player_matches/0 returns all player_matches" do
  #    [p1, p2, p3] = insert_list(3, :player_match)
  #    [m1, m2, m3] = Api.list_player_matches!()
  #
  #    assert_player_match(m1, p1)
  #    assert_player_match(m2, p2)
  #    assert_player_match(m3, p3)
  #  end

  test "get_player_matches!/1 returns the player_matches with given id" do
    player_match = insert(:player_match)

    assert_player_match(Api.get_player_match!(player_match.id), player_match)
  end

  test "create_player_match/1 with valid data creates a player_matches" do
    [user] = create_players(1)

    params =
      params_for(:player_match)
      |> Map.put(:user_id, user.id)

    {:ok, player_match} = Api.create_player_match(params)

    assert_player_match(Api.get_player_match!(player_match.id), player_match)
  end

  test "create_player_match/1 with invalid data returns changeset error" do
    assert {:error, %Ash.Error.Invalid{}} = Api.create_player_match(%{platform_username: 21})
  end

  test "update_player_match/1 with valid data updates the player_match" do
    [user] = create_players(1)

    params =
      params_for(:player_match)
      |> Map.put(:user_id, user.id)

    {:ok, player_match} = Api.create_player_match(params)

    {:ok, updated_player_match} =
      Api.update_player_match(player_match, %{platform_username: "xx_superprohacker_xx"})

    refute player_match == updated_player_match
  end

  test "update_player_match/1 with invalid data return changeset error" do
    [user] = create_players(1)

    params =
      params_for(:player_match)
      |> Map.put(:user_id, user.id)

    {:ok, player_match} = Api.create_player_match(params)

    assert {:error, %Ash.Error.Invalid{}} =
             Api.update_player_match(player_match, %{platform_username: 10})
  end

  test "delete_player_match/1 deletes the player_match" do
    player_match = insert(:player_match)

    assert :ok = Api.delete_player_match!(player_match)
    assert_raise Ash.Error.Query.NotFound, fn -> Api.get_player_match!(player_match.id) end
  end
end
