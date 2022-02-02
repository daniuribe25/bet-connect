defmodule PlConnect.BetProcessTest do
  use PlConnect.DataCase, async: false
  use Oban.Testing, repo: PlConnect.Repo
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  alias PlConnect.Helpers
  alias PlConnect.Workers.Bet
  alias PlConnect.Workers.Match
  alias PlConnect.Api

  require Ash.Changeset

  setup do
    populate_bet_values()
  end

#  test "successfully queue" do
#    %{bet_id: "abc", retry_count: 0}
#    |> Bet.Process.new()
#    |> Oban.insert()
#
#    assert_enqueued(worker: Bet.Process, args: %{bet_id: "abc", retry_count: 0})
#  end

  test "should not process completed bets" do
    players = create_players(4)
    team = create_team(players)
    bet =
      create_bet(team)
      |> Api.set_user_bet_complete!()

    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    assert_enqueued(worker: Bet.Process, args: %{bet_id: bet.id, retry_count: 0})

    assert %{success: 1, failure: 0} =
             Oban.drain_queue(queue: :bet_processor, with_scheduled: true)

    assert [] = all_enqueued(worker: Bet.Process)
  end

  test "should en-queue searches for all users" do
    players = create_players(4)
    team = create_team(players)
    bet = create_bet(team)


    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    assert_enqueued(worker: Bet.Process, args: %{bet_id: bet.id, retry_count: 0})

    assert %{success: 1, failure: 0} =
             Oban.drain_queue(queue: :bet_processor, with_scheduled: true)

    Enum.each(players, fn player ->
      platform = Helpers.get_platform(player)
      assert_enqueued(worker: Match.Update, args: %{user_id: player.id, platform: platform})
    end)

    assert_enqueued(worker: Bet.Process, args: %{bet_id: bet.id, retry_count: 1})
  end

  # Sucessful queue (data available)
  test "should queue and process the bet with all data" do
    players = create_players(4)
    team = create_team(players)
    bet = create_bet(team)

    insert_matches(players, bet)

    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    {:ok, new_bet} = perform_job(Bet.Process, %{bet_id: bet.id, retry_count: 0})

    [created, s_start, a_resolved, s_ended] = new_bet.events
    assert new_bet.status == :complete
    assert created.event == :created
    assert s_start.event == :search_started
    assert a_resolved.event == :automatic_resolved
    assert s_ended.event == :search_ended
  end

  # Sucessful queue (data available)
  test "should queue and process the bet with all data with a team of 2 players" do
    players = create_players(2)
    team = create_team(players)
    bet = create_bet(team)

    insert_matches(players, bet)

    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    {:ok, new_bet} = perform_job(Bet.Process, %{bet_id: bet.id, retry_count: 0})


    [created, s_start, a_resolved, s_ended] = new_bet.events
    assert new_bet.status == :complete
    assert created.event == :created
    assert s_start.event == :search_started
    assert a_resolved.event == :automatic_resolved
    assert s_ended.event == :search_ended
    assert length(new_bet.team.teammates) == 2
  end

  test "testing a bet and make a refund" do
    players = create_players(3)
    team = create_team(players, :rookie)
    bet = create_bet(team)
      |> Api.load!([team: [teammates: [:user]]])

    Enum.each(bet.team.teammates, fn %{user: user} ->
      assert user.wallet.funds == 95
    end)

    bet = Api.refund_bet!(bet)
      |> Api.load!([team: [teammates: [:user]]])

    Enum.each(bet.team.teammates, fn %{user: user} ->
      assert user.wallet.funds == 100
    end)

    transactions = Api.get_wallet_transactions_by_bet_id!(bet.id)

    Enum.filter(transactions, &(&1.status == :created))
    |> Enum.each(fn
      %{type: :main} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 100
        assert transaction.post_wallet_balance == 97
      %{type: :kills} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 97
        assert transaction.post_wallet_balance == 96
      %{type: :placement} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 96
        assert transaction.post_wallet_balance == 95
    end)
    Enum.filter(transactions, &(&1.status == :refunded))
    |> Enum.each(fn
      %{type: :main} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 95
        assert transaction.post_wallet_balance == 100
      %{type: :kills} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 95
        assert transaction.post_wallet_balance == 100
      %{type: :placement} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 95
        assert transaction.post_wallet_balance == 100
    end)
  end


  test "testing with rookie bet and legend matches" do
    players = create_players(3, 100, 0.25)
      |> Enum.map(fn player ->
        Api.update_user_difficulty_factor!(player, :main, 4)
        |> Api.update_user_difficulty_factor!(:kills, 4)
        |> Api.update_user_difficulty_factor!(:placement, 5)
        |> Api.update_user_difficulty_factor!(:damage, 0.25)
        |> Api.update_user_difficulty_factor!(:match, 0.25)
      end)
    team = create_team(players, :rookie)

    bet = create_bet(team)

    insert_matches(players, bet)

    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    {:ok, new_bet} = perform_job(Bet.Process, %{bet_id: bet.id, retry_count: 0})

    assert new_bet.required_result |> Enum.at(0) |> Map.get(:won) == true
    assert new_bet.required_result |> Enum.at(1) |> Map.get(:won) == true
    assert new_bet.required_result |> Enum.at(2) |> Map.get(:won) == true
    Enum.each(new_bet.team.teammates, fn %{user: user} ->
      assert user.difficulty.kills["value"] == 5
      assert user.difficulty.placement["value"] == 6
      assert user.wallet.funds == 124
    end)

    transactions = Api.get_wallet_transactions_by_bet_id!(new_bet.id)

    Enum.filter(transactions, &(&1.status == :created))
    |> Enum.each(fn
      %{type: :main} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 100
        assert transaction.post_wallet_balance == 97
      %{type: :kills} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 97
        assert transaction.post_wallet_balance == 96
      %{type: :placement} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 96
        assert transaction.post_wallet_balance == 95
    end)
    Enum.filter(transactions, &(&1.status == :complete))
    |> Enum.each(fn
      %{type: :main} = transaction ->
        assert transaction.won
        assert transaction.prev_wallet_balance == 95
        assert transaction.post_wallet_balance == 106
      %{type: :kills} = transaction ->
        assert transaction.won
        assert transaction.prev_wallet_balance == 106
        assert transaction.post_wallet_balance == 115
      %{type: :placement} = transaction ->
        assert transaction.won
        assert transaction.prev_wallet_balance == 115
        assert transaction.post_wallet_balance == 124
    end)
  end

  test "testing with legend bet and rookie matches" do
    players = create_players(3)
    team = create_team(players)
    bet = create_bet(team)

    insert_matches(players, bet, :rookie)

    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    {:ok, new_bet} = perform_job(Bet.Process, %{bet_id: bet.id, retry_count: 0})

    assert new_bet.required_result |> Enum.at(0) |> Map.get(:won)
    assert new_bet.required_result |> Enum.at(1) |> Map.get(:won)
    assert new_bet.required_result |> Enum.at(2) |> Map.get(:won)

    Enum.each(new_bet.team.teammates, fn %{user: user} ->
      assert user.wallet.funds == 124
    end)

    transactions = Api.get_wallet_transactions_by_bet_id!(new_bet.id)

    Enum.filter(transactions, &(&1.status == :created))
    |> Enum.each(fn
      %{type: :main} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 100
        assert transaction.post_wallet_balance == 95
      %{type: :kills} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 95
        assert transaction.post_wallet_balance == 92
      %{type: :placement} = transaction ->
        refute transaction.won
        assert transaction.prev_wallet_balance == 92
        assert transaction.post_wallet_balance == 89
    end)
    Enum.filter(transactions, &(&1.status == :complete))
    |> Enum.each(fn
      %{type: :main} = transaction ->
        assert transaction.won
        assert transaction.prev_wallet_balance == 89
        assert transaction.post_wallet_balance == 102
      %{type: :kills} = transaction ->
        assert transaction.won
        assert transaction.prev_wallet_balance == 102
        assert transaction.post_wallet_balance == 113
      %{type: :placement} = transaction ->
        assert transaction.won
        assert transaction.prev_wallet_balance == 113
        assert transaction.post_wallet_balance == 124
    end)
  end

  test "should re-queue when we dont have all players in cache" do
    players = create_players(4)
    team = create_team(players)
    bet = create_bet(team)

    # remove the last player on the match creation
    insert_matches(List.delete_at(players, 3), bet)

    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    assert_enqueued(worker: Bet.Process, args: %{bet_id: bet.id, retry_count: 0})
    assert %{success: 1, failure: 0} = Oban.drain_queue(queue: :bet_processor, with_scheduled: true)
    assert_enqueued(worker: Bet.Process, args: %{bet_id: bet.id, retry_count: 1})
  end

  test "should have the field user_stats with all stats from match per user" do
    players = create_players(3)
    team = create_team(players)
    bet = create_bet(team)

    insert_matches(players, bet)

    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    {:ok, new_bet} = perform_job(Bet.Process, %{bet_id: bet.id, retry_count: 0})
      |> elem(1)
      |> Api.load([:user_stats, :lobby_stats])

    Enum.each(players, fn player ->
      {_, profile, platform, _} = Helpers.iterate_platforms(player)
      stat = Enum.find(new_bet.user_stats, &(&1.platform_username == profile))
      assert_fields(stat, %{
        damage: 600,
        deaths: 7,
        gulag: true,
        kills: 16,
        assists: 7,
        placement: 3,
        platform: String.to_atom(platform),
        platform_username: profile,
        user_id: player.id
      }, Map.keys(stat))
    end)
  end

  test "should have the field user_stats empty" do
    players = create_players(3)
    team = create_team(players)
    bet = create_bet(team)

    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    {:ok, new_bet} = perform_job(Bet.Process, %{bet_id: bet.id, retry_count: 0})
                     |> elem(1)
                     |> Api.load([:user_stats])

    assert new_bet.user_stats == []
  end

  test "get_user_bet_history/1 should have the field user_stats" do
    [leader | _] = players = create_players(2)
    team = create_team(players)
    bet = create_bet(team)

    insert_matches(players, bet)

    %{bet_id: bet.id, retry_count: 0}
    |> Bet.Process.new()
    |> Oban.insert()

    {:ok, _} = perform_job(Bet.Process, %{bet_id: bet.id, retry_count: 0})

    history_loaded = Api.get_user_bet_history!(leader.id)
      |> Map.get(:results)
      |> Enum.at(0)
      |> Api.load!([:user_stats, :lobby_stats])

    assert history_loaded.lobby_stats.kda == 1.7
    assert history_loaded.lobby_stats.kills == 16
    assert history_loaded.lobby_stats.time_alive == 526

    Enum.each(players, fn player ->
      {_, profile, platform, _} = Helpers.iterate_platforms(player)
      stat = Enum.find(history_loaded.user_stats, &(&1.platform_username == profile))
      assert_fields(stat, %{
        damage: 600,
        deaths: 7,
        gulag: true,
        kills: 16,
        assists: 7,
        placement: 3,
        platform: String.to_atom(platform),
        platform_username: profile,
        user_id: player.id
      }, Map.keys(stat))
    end)
  end


end
