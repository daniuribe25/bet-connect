defmodule PlConnect.Cod.UserBetHistory do
  @moduledoc """
  Resource for bet history for each user
  """
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [
      AshGraphql.Resource,
      AshAdmin.Resource
    ]

  alias PlConnect.Helpers
  alias PlConnect.Cod.Team
  alias PlConnect.Cod.User

  import PlConnect.Cod.Resource.Bet.Changes.CheckBetRefunded, only: [check_bet_refunded: 0]
  import PlConnect.Cod.Resource.Bet.Changes.BetRefunded, only: [bet_refunded: 0]
  import PlConnect.Cod.Resource.Bet.Changes.NotifyBetCancelled, only: [notify_bet_cancelled: 0]
  import PlConnect.Cod.Resource.Bet.Changes.CheckWalletAmount, only: [check_wallet_amount: 0]
  import PlConnect.Cod.Resource.Bet.Changes.CheckWholeTeamPublic, only: [check_whole_team_public: 0]
  import PlConnect.Cod.Resource.Bet.Changes.ProcessLevel, only: [process_selected: 0]
  import PlConnect.Cod.Resource.Bet.Changes.ProcessOban, only: [process_oban: 0]
  import PlConnect.Cod.Resource.Bet.Changes.WonBetManually, only: [won_bet_manually: 0]
  import PlConnect.Cod.Resource.Changes.PushToAttribute, only: [push_to_attribute: 2]
  import PlConnect.Cod.Resource.Bet.Changes.EnsureCanCreateBets, only: [ensure_can_create_bets: 0]
  import PlConnect.Cod.Resource.Bet.Changes.RefundedDataAnalytics, only: [refunded_data_analytics: 0]

  postgres do
    table "users_bet_history"
    repo PlConnect.Repo
  end

  admin do
    read_actions [:read_admin, :read_waiting, :read_team_waiting]

    format_fields id: {Helpers, :id_link_format, []},
                  result_match_cod_id: {Helpers, :match_link, []},
                  owner_id: {Helpers, :user_owner_format, []},
                  team_id: {Helpers, :user_team_format, []},
                  status: {Helpers, :element_slug, []},
                  map: {Helpers, :element_slug, []},
                  bet_format: {Helpers, :element_slug, []},
                  inserted_at: {Helpers, :format_date, []},
                  updated_at: {Helpers, :format_date, []}
  end

  graphql do
    type :user_bet_history

    queries do
      list :get_user_bet_history, :read
    end

    mutations do
      create :place_team_bet, :create
      update :set_bet_results, :admin_set_results
      update :cancel_bet, :cancel
      update :refund_bet, :refund
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :difficulty, PlConnect.Cod.Team.Embedded.Difficulty
    attribute :bet_total_amount, :float

    attribute :status, :atom do
      constraints one_of: [:waiting, :complete, :cancelled, :refunded]
      allow_nil? false
      default :waiting
    end

    attribute :map, :atom do
      constraints one_of: [:verdansk, :rebirth_island, :caldera]
      allow_nil? false
    end

    attribute :bet_format, :atom do
      constraints one_of: [:rookie, :legend, :diamond]
      allow_nil? false
    end

    attribute :user_bets_level_result, {:array, PlConnect.Cod.Team.BetLevelResult}

    attribute :required_result, {:array, PlConnect.Cod.Team.BetLevelRequirement}

    attribute :stats, PlConnect.Cod.Bet.Stats

    attribute :events, {:array, PlConnect.Cod.Bet.BetLog}, default: []

    attribute :result_match_cod_id, :decimal,
      constraints: [min: 0, max: 18_446_744_073_709_551_614]

    create_timestamp :inserted_at, private?: false, allow_nil?: true
    update_timestamp :updated_at, private?: false, allow_nil?: true
  end

  relationships do
    belongs_to :team, Team
    belongs_to :owner, User
  end

  calculations do
    calculate :user_stats, {:array, PlConnect.Cod.Bet.UserStat}, PlConnect.Cod.Resource.Bet.Calculation.UserStats
    calculate :lobby_stats, PlConnect.Cod.Bet.LobbyStats, PlConnect.Cod.Resource.Bet.Calculation.LobbyStats
  end

  code_interface do
    define :get_user_bet_history, action: :read, args: [:owner_id]
    define :get_team_bets, action: :read_team_waiting, args: [:team_id]
    define :get_user_bets, action: :read_waiting, args: [:owner_id]
    define :set_user_bet_complete, action: :complete, args: []
    define :set_bet_results, action: :admin_set_results

    define :update_user_bet_result,
      action: :update_results,
      args: [:result_match_cod_id, :required_result, :stats]

    define :user_bet_history_push_event, action: :push_event, args: [:event]
    define :create_bet, action: :create, args: [:team_id]
    define :cancel_bet, action: :cancel
    define :refund_bet, action: :refund

    define :get_bet_history, action: :read_id, args: [:bet_id], get?: true
  end

  actions do
    read :read_admin do
      pagination default_limit: 20, offset?: true
      prepare build(sort: [updated_at: :desc])
    end

    read :default_read do
      primary? true
    end

    read :read do
      pagination default_limit: 5, offset?: true
      argument :owner_id, :uuid, allow_nil?: false
      filter owner_id: arg(:owner_id)
    end

    read :read_waiting do
      prepare build(sort: [updated_at: :desc])

      argument :owner_id, :uuid, allow_nil?: false

      filter owner_id: arg(:owner_id), status: :waiting
    end

    read :read_team_waiting do
      prepare build(sort: [updated_at: :desc])

      argument :team_id, :uuid, allow_nil?: false

      filter team_id: arg(:team_id), status: :waiting
    end

    read :read_id do
      argument :bet_id, :uuid, allow_nil?: false

      prepare build(load: [:owner, team: [:owner, teammates: [:user]]])

      filter id: arg(:bet_id)
    end

    # when creating check that there's no bet's created for the team x time ago
    create :create do
      accept [:map, :bet_format, :user_bets_level_result]
      argument :team_id, :uuid, allow_nil?: false
      change ensure_can_create_bets()
      # check time of creation

      # check the results contains the required data
      change check_whole_team_public()

      # Check if the users has enough money inside their wallet
      change check_wallet_amount()

      # Calculate amount of money to be bet and save records
      change process_selected()

      # Process Oban alerts
      change process_oban()
    end

    update :update, primary?: true

    update :complete do
      accept []

      change set_attribute(:status, :complete)
    end

    update :update_stats do
      accept [:stats]
    end

    update :update_results do
      accept [:result_match_cod_id, :required_result, :stats]

      change push_to_attribute(:events, %{event: :automatic_resolved})
    end

    update :admin_set_results do
      accept []

      argument :won_main_bet, :boolean, allow_nil?: false, default: false

      argument :won_kills_bet, :boolean, allow_nil?: false, default: false

      argument :won_placement_bet, :boolean, allow_nil?: false, default: false

      argument :won_match_bet, :boolean, allow_nil?: false, default: false

      argument :won_damage_bet, :boolean, allow_nil?: false, default: false

      change won_bet_manually()

      change push_to_attribute(:events, %{event: :manual_resolved})
    end

    update :push_event do
      argument :event, :map

      change push_to_attribute(:events, {:arg, :event})
    end

    update :cancel do
      accept []

      change notify_bet_cancelled()

      change push_to_attribute(:events, %{event: :cancelled})

      change set_attribute(:status, :cancelled)
    end

    update :refund do
      accept []

      change check_bet_refunded()

      change bet_refunded()

      change refunded_data_analytics()

      change push_to_attribute(:events, %{event: :refunded})

      change set_attribute(:status, :refunded)
    end
  end
end
