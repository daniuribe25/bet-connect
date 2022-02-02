defmodule PlConnect.Intercom.ApiClient do
  @moduledoc """
  Api wrapperfor intercom api
  """
  use Tesla

  @retool_url Application.get_env(:pl_connect, :retool_url)
  @environment Application.get_env(:pl_connect, :environment)
  @berbix_config Application.get_env(:pl_connect, :berbix_config)

  plug Tesla.Middleware.BaseUrl, "https://api.intercom.io"
  plug Tesla.Middleware.Headers, [
    {"Authorization", "Bearer #{Application.get_env(:pl_connect, :intercom_token)}"},
    {"Accept", "application/json"}
  ]
  plug Tesla.Middleware.JSON

  alias PlConnect.Helpers
  alias PlConnect.Cod.User
  alias PlConnect.Cod.Team


  defp send_message(body) do
    data = %{
      "from" => %{
        "type" => "user",
        "id" => "#{Application.get_env(:pl_connect, :intercom_user_id)}"
      },
      "body" => body
    }

    post("/conversations", data)
  end


  defp retool_link(:match_resolve, bet_id), do: "#{@retool_url}/apps/match-resolve?id=#{bet_id}&_environment=#{@environment}"
  defp retool_link(:user_details, user_id), do: "#{@retool_url}/apps/user?=&id=#{user_id}"
  defp berbix_link(:dashboard, transaction_id),
       do: "https://dashboard.berbix.com/transaction?orgId=#{@berbix_config[:berbix_org_id]}&transactionId=#{transaction_id}"
  defp cod_tracker(:profile, %User{} = user),
       do: "https://cod.tracker.gg/warzone/profile/#{Helpers.get_platform(user)}/#{Helpers.get_username_platform(user)}/overview"

  @doc """
  Message to check if the match was not confirm
  """
  def warning_admin_match(record) do
    send_message("""
      Hello, we are have not being able to auto confirm a match for PL Connect

      You can check out the bet and autoconfirm it at:

      #{retool_link(:match_resolve, record.id)}

      Team owner:
      #{retool_link(:user_details, record.owner_id)}
    """)
  end

  @doc """
  Template message for bets with status :waiting
  """
  def msg_bet_is_waiting(record, schedule_seconds, notice) do
    hour_bet = Helpers.format_date_hour(record.inserted_at)
    date_bet = Helpers.format_dates(record.inserted_at)

    date_calculated = Helpers.add_seconds(record.inserted_at, schedule_seconds)
    hour_schedule = Helpers.format_date_hour(date_calculated)
    date_schedule = Helpers.format_dates(date_calculated)
    username_owner = Helpers.get_username_platform(record.owner)

    usernames =
      Enum.map(record.team.teammates, fn teammate ->
        Helpers.get_username_platform(teammate.user)
      end)

    teammates_trackers =
      Enum.filter(record.team.teammates, fn teammate ->
        username_owner != Helpers.get_username_platform(teammate.user)
      end)
      |> Enum.map(fn teammate ->
        "#{cod_tracker(:profile, teammate.user)}"
      end)

    send_message("""
      Hey! #{notice} alert for a PL Connect Match waiting for resolution.

      #{Helpers.arr_to_string(usernames)} completed a match.

      Match page: #{retool_link(:match_resolve, record.id)}

      The captain’s CODTracker: #{cod_tracker(:profile, record.owner)}

      If that doesn’t work, use these links - #{Helpers.arr_to_string(teammates_trackers)} - for the other team member COD Tracker links.

      This bet was placed at #{hour_bet} on #{date_bet}.
      Data is expected to be available on CODTracker at #{hour_schedule} on #{date_schedule}.
    """)
  end

  @doc """
  Send the message when the bet was made it
  """
  def new_bet_message(record) do
    hour_bet = Helpers.format_date_hour(record.inserted_at)
    date_bet = Helpers.format_dates(record.inserted_at)

    username_owner = Helpers.get_username_platform(record.owner)

    usernames =
      Enum.filter(record.team.teammates, fn teammate ->
        username_owner != Helpers.get_username_platform(teammate.user)
      end)
      |> Enum.map(fn teammate ->
        Helpers.get_username_platform(teammate.user)
      end)

    send_message("""
      Hey! #{username_owner} has made a bet through PL Connect.

      Players: #{Helpers.arr_to_string(usernames)}

      Match page: #{retool_link(:match_resolve, record.id)}

      This bet was placed at #{hour_bet} on #{date_bet}.
    """)
  end

  @doc """
  Message that show when user isnt end their berbix process
  """
  def user_need_manual_age_validation(%User{} = user) do
    username_owner = Helpers.get_username_platform(user)
    send_message("""
      Hello, the user #{username_owner} could not verify their ID, this must require manual verification,
      check the links below, open the dashboard link to manually validate

      Berbix Dashboard Link: #{berbix_link(:dashboard, user.berbix_transaction_id)}
      Profile Link: #{retool_link(:user_details, user.id)}
    """)
  end

  @doc """
  Message that show when user isnt end their berbix process
  """
  def team_won_to_much_money(%Team{teammates: teammates}) do
    send_message("""
      Hello, the whole team won too much money to get our attention, check their profiles

      Links: #{Enum.map(teammates, &retool_link(:user_details, &1.user_id)) |> Enum.join(", ")}
    """)
  end
end
