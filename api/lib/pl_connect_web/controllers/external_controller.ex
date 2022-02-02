defmodule PlConnectWeb.ExternalController do
  @moduledoc false
  use PlConnectWeb, :controller

  require Ash.Query

  alias PlConnect.Api
  alias PlConnect.Helpers
  alias PlConnect.Cod.PlayerMatch
  alias PlConnect.ApiClient.TourneysClient
  # workers
  alias PlConnect.Workers.Match.Workflow.Update
  alias PlConnect.Workers.Match.Workflow.Notify

  @default_match %{
    userIds: [],
    teamPlayerHandles: [],
    placement: 100,
    teamTotalKills: 0,
    teamTotalDamage: 0
  }

  @doc """
  datetime format 2016-02-29T22:25:00-06:00
  """
  def matches(conn, %{"users" => users, "start_date" => start_date, "end_date" => end_date}) do
    start_date = Timex.parse!(start_date, "{ISO:Extended}")
    end_date = Timex.parse!(end_date, "{ISO:Extended}")

    grouped_data = Enum.reduce(users, [], &(get_matches(&1, start_date, end_date) ++ &2))
      |> Enum.group_by(&(&1.match_cod_id))

    data = Map.keys(grouped_data)
      |> Enum.map(fn key ->
        grouped_data = Map.get(grouped_data, key)
          |> Enum.group_by(&(&1.placement))
        Map.keys(grouped_data)
        |> Enum.map(fn key ->
          Map.get(grouped_data, key)
          |> Enum.reduce(@default_match, fn match, acc ->
            players_data = match.json_response["segments"]
              |> Enum.at(0)
              |> Map.get("metadata")
            players = [players_data["platformUserHandle"]] ++  Enum.map(players_data["teammates"], &(&1["platformUserHandle"]))
            acc
            |> Map.update!(:teamPlayerHandles, &(&1 ++ players))
            |> Map.update!(:userIds, &(&1 ++ [match.user_id]))
            |> Map.update!(:placement, &min(&1, match.placement))
            |> Map.update!(:teamTotalKills, &(&1 + match.kills))
            |> Map.update!(:teamTotalDamage, &(&1 + match.damage))
          end)
        end)
        |> Enum.map(fn match -> Map.update!(match, :teamPlayerHandles, &Enum.uniq(&1)) end)
        |> (&(%{teams: &1})).()
        |> Map.put(:codMatchId, key)
      end)

    conn
    |> put_status(200)
    |> json(%{data: data})
  end

  defp get_matches(id, start_date, end_date) do
    PlayerMatch
    |> Ash.Query.filter(user_id == ^id and match_date >= ^start_date and match_date <= ^end_date)
    |> Ash.Query.sort(match_date: :asc)
    |> Api.read!()
    |> Enum.uniq_by(&(&1.match_cod_id))
  end

  def schedule(conn, %{"users" => users, "tourney_id" => tourney_id}) do
    {ids, workflow} = Enum.reduce(users, {[], Update.new_workflow()}, fn user_id, {ids, workflow} ->
      user = Api.get_user!(user_id)
      platforms = PlConnect.Helpers.get_user_platforms(user)
      id = "user_#{user.id}"
      workflow = Update.add(workflow, id, Update.new(%{user_id: user_id, platform: List.first(platforms)}))
      {ids ++ [id], workflow}
    end)

    workflow
    |> Notify.add(:notify, Notify.new(%{tourney_id: tourney_id, start_date: Timex.now()}), deps: ids)
    |> Oban.insert_all()

    conn
    |> put_status(200)
    |> json(%{data: %{result: :scheduled}})
  end

  # client api

  defp send_error(conn, http_code, data) do
    put_status(conn, http_code)
    |> json(%{messages: [%{data: data, code: http_code}]})
  end

  def all(%{assigns: %{actor: user}} = conn, _) do
    case TourneysClient.active_tournaments(user.id) do
      {status, body} -> send_error(conn, status, body)
      tournaments ->
        conn
        |> put_status(200)
        |> json(%{data: %{tournaments: tournaments}})
    end
  end

  def get(%{assigns: %{actor: user}} = conn, %{"tourney_id" => tournament_id}) do
    case TourneysClient.get_tournament_by_id(tournament_id, user.id) do
      {status, body} -> send_error(conn, status, body)
      tournament ->
        conn
        |> put_status(200)
        |> json(%{data: %{tournament: tournament}})
    end
  end

  def join(%{assigns: %{actor: user}} = conn, %{"tourney_id" => tournament_id, "team_id" => team_id}) do
    case TourneysClient.get_tournament_by_id(tournament_id, user.id) do
      {status, body} -> send_error(conn, status, body)
      %{"tournamentStatus" => "NOT STARTED"} = tournament ->
        team = Api.get_team_by_id!(team_id)
        join_step_1(conn, tournament, team)
    end
  end

  defp join_step_1(conn, tournament, team) do
    fee = get_in(tournament, ["tournamentConfig", "configJson", "entryFeeValue"]) || 1
    users_without_money = team.teammates
      |> Enum.filter(&(&1.user.wallet.funds < fee))
      |> Enum.map(&Helpers.get_username_platform(&1.user))
    if Enum.empty?(users_without_money) do
      join_step_2(conn, tournament, team)
    else
      message = """
      The #{Helpers.text_plural_singular(users_without_money, "players", "player")}
      #{Helpers.arr_to_string(users_without_money)} doesn´t have enough money to join the tournament
      """
      send_error(conn, 409, message)
    end
  end

  defp join_step_2(conn, tournament, team) do
    teammates = Enum.map(team.teammates, fn mate ->
      %{
        userId: mate.user.id,
        playerHandle: Helpers.get_username_platform(mate.user)
      }
    end)

    data = %{
      tournamentId: tournament["id"],
      team: %{
          teamId: team.id,
          teamName: "#{Enum.find(teammates, fn member -> member.userId == team.owner_id end).playerHandle}'s team",
          teamMembers: teammates,
          skillRating: 0
      }
    }

    case TourneysClient.join_tournament(data) do
      {status, body} -> send_error(conn, status, body)
      tournament ->
        fee = get_in(tournament, ["tournament","tournamentConfig", "configJson", "entryFeeValue"]) || 1
        Enum.each(team.teammates, fn mate ->
          funds = mate.user.wallet.funds
          final_balance = funds - fee

          Api.update_user_wallet(mate.user, %{wallet: %{funds: final_balance}})

          Api.create_wallet_transaction(
            nil,
            team.id,
            mate.user.id,
            %{
              bet_total_amount: fee,
              prev_wallet_balance: funds,
              post_wallet_balance: final_balance,
              type: :tournament,
              won: false,
              status: :tournament_join,
              metadata: %{
                fee: fee,
                tournament_id: tournament["id"]
              }
            }
          )
        end)

        conn
        |> put_status(201)
        |> json(%{data: %{result: tournament}})
    end
  end

  def leave(conn, %{"tourney_id" => tournament_id, "team_id" => team_id}) do
    case TourneysClient.get_tournament_by_id(tournament_id) do
      {status, body} -> send_error(conn, status, body)
      tournament ->
        team = Api.get_team_by_id!(team_id)
        leave_step_1(conn, tournament, team)
    end
  end

  defp leave_step_1(conn, tournament, team) do
    case TourneysClient.leave_tournament(tournament["id"], team.id) do
      {status, body} -> send_error(conn, status, body)
      tournament ->
        fee = get_in(tournament, ["tournament","tournamentConfig", "configJson", "entryFeeValue"]) || 1
        Enum.each(team.teammates, fn mate ->
          funds = mate.user.wallet.funds
          final_balance = funds + fee

          Api.update_user_wallet(mate.user, %{wallet: %{funds: final_balance}})

          Api.create_wallet_transaction(
            nil,
            team.id,
            mate.user.id,
            %{
              bet_total_amount: fee,
              prev_wallet_balance: funds,
              post_wallet_balance: final_balance,
              type: :tournament,
              won: false,
              status: :tournament_leave,
              metadata: %{
                fee: fee,
                tournament_id: tournament["id"]
              }
            }
          )
        end)

        conn
        |> put_status(201)
        |> json(%{data: %{result: tournament}})
    end
  end

  def refund_users(conn, params) do
    %{"users" => users, "amount" => amount, "tourney_id" => tournament_id} = params
    Enum.each(users, fn %{"user_id" => user_id, "team_id" => team_id} ->
      user = Api.get_user!(user_id)

      adjustBalance(user, team_id, amount, tournament_id )
    end)

    conn
        |> put_status(200)
        |> json(%{data: %{result: true}})
  end

  defp adjustBalance(user, team_id, amount, tournament_id) do
    funds = user.wallet.funds
    final_balance = funds + amount

    Api.update_user_wallet(user, %{wallet: %{funds: final_balance}})

    Api.create_wallet_transaction(
      nil,
      team_id,
      user.id,
      %{
        bet_total_amount: amount,
        prev_wallet_balance: funds,
        post_wallet_balance: final_balance,
        type: :tournament,
        won: false,
        status: :tournament_leave,
        metadata: %{
          fee: amount,
          tournament_id: tournament_id
        }
      }
    )
  end

  def get_tournaments_by_user(%{assigns: %{actor: user}} = conn, _) do
    IO.puts(user.id)
    case TourneysClient.get_tournaments_by_user(user.id) do
      {status, body} -> send_error(conn, status, body)
      tournament ->
        conn
        |> put_status(200)
        |> json(%{data: %{tournament: tournament}})
    end
  end
end
