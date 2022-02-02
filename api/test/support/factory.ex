defmodule PlConnect.Factory do
  # with Ecto
  use ExMachina.Ecto, repo: PlConnect.Repo

  alias PlConnect.Cod.User
  alias PlConnect.Cod.Wallet
  alias PlConnect.Cod.PlayerMatch
  alias PlConnect.Cod.UserBetHistory
  alias PlConnect.InviteLobby

  def invite_lobby_factory do
    leader_id = UUID.uuid4()

    %InviteLobby{
      leader_id: leader_id,
      metadata: %{foo: "bar"},
      users: [%{user_id: leader_id, status: :joined}, %{user_id: UUID.uuid4(), status: :pending}]
    }
  end

  def user_bet_history_factory do
    %UserBetHistory{
      map: :rebirth_island,
      bet_format: :legend
    }
  end

  def wallet_factory do
    %Wallet{funds: :rand.uniform(100) + 50}
  end

  def user_factory do
    %User{
      password_hash: sequence("password_hash"),
      psn_platform_username: sequence("psn_username"),
      xbl_platform_username: sequence("xbl_username"),
      battlenet_platform_username: sequence("battlenet_username"),
      email: sequence(:email, &"me-#{&1}@playerslounge.co"),
      phone: sequence(:phone, &"0000#{&1}", start_at: 100000),
      wallet: build(:wallet)
    }
  end

  def player_match_factory do
    match_cod_id = sequence(:match_cod_id, &"#{&1}")
    kills = :rand.uniform(10) + 10
    damage = :rand.uniform(1000) + 1000
    placement = :rand.uniform(10) + 1
    match_date = DateTime.utc_now() |> DateTime.to_string()
    match_map = sequence(:match_map, ["verdansk", "rebirth_island"])
    match_type = sequence(:match_type, ["resurgence", "br", "plunder"])
    match_teamcomp = sequence(:match_teamcomp, ["quads", "trios", "duos"])

    %PlayerMatch{
      match_cod_id: match_cod_id,
      platform_username: sequence("platform_username"),
      platform: "psn",
      match_map: match_map,
      match_type: match_type,
      match_teamcomp: match_teamcomp,
      match_date: match_date,
      kills: kills,
      damage: damage,
      placement: placement,
      user: build(:user),
      json_response: %{
        "segments" => [],
        "metadata" => %{
          "modeName" => "#{match_type} #{match_teamcomp}",
          "mapName" => match_map,
          "timestamp" => match_date
        },
        "attributes" => %{
          "id" => match_cod_id
        }
      }
    }
  end
end
