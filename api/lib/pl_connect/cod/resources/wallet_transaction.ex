defmodule PlConnect.Cod.WalletTransaction do
  @moduledoc """
  Resource for save the transactions of the Bets
  """
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [
      AshGraphql.Resource,
      AshAdmin.Resource
    ]

  alias PlConnect.Cod.UserBetHistory
  alias PlConnect.Cod.User
  alias PlConnect.Cod.Team

  postgres do
    table "wallet_transactions"
    repo PlConnect.Repo
  end

  graphql do
    type :wallet_transactions

    mutations do
      create :create_wallet_transaction, :create
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :bet_total_amount, :float, allow_nil?: true, default: nil
    attribute :prev_wallet_balance, :float, allow_nil?: true, default: nil
    attribute :post_wallet_balance, :float, allow_nil?: false
    attribute :won, :boolean, allow_nil?: true, default: nil
    attribute :won_reward, :float, allow_nil?: true, default: nil

    attribute :type, :atom do
      constraints one_of: [:main, :kills, :placement, :match, :damage, :from_retool, :deposit, :tournament]
      allow_nil? false
    end

    attribute :status, :atom do
      constraints one_of: [:created, :waiting, :complete, :cancelled, :refunded, :updated, :deposit, :tournament_join, :tournament_leave]
      allow_nil? false
    end

    attribute :metadata, :map, default: %{}

    create_timestamp :inserted_at, private?: false, allow_nil?: true
  end

  relationships do
    belongs_to :user, User
    belongs_to :bet_history, UserBetHistory
    belongs_to :team, Team
  end

  code_interface do
    define :get_wallet_transactions, action: :read
    define :get_wallet_transactions_by_bet_id, action: :read_by_id, args: [:bet_history_id]
    define :create_wallet_transaction,
      action: :create,
      args: [:bet_history_id, :team_id, :user_id]
    define :get_last_deposit, action: :read_last_deposit, args: [:user_id], get?: true
  end

  actions do
    create :create do
      argument :bet_history_id, :uuid, allow_nil?: true
      argument :team_id, :uuid, allow_nil?: true
      argument :user_id, :uuid, allow_nil?: false

      change manage_relationship(:bet_history_id, :bet_history, type: :replace)
      change manage_relationship(:team_id, :team, type: :replace)
      change manage_relationship(:user_id, :user, type: :replace)
    end

    read :read, primary?: true
    read :read_by_id do
      argument :bet_history_id, :uuid, allow_nil?: true

      filter expr(bet_history_id == ^arg(:bet_history_id))
    end
    read :read_last_deposit do
      argument :user_id, :uuid, allow_nil?: true

      filter expr(user_id == ^arg(:user_id) and type == :deposit)
      prepare build(limit: 1, sort: [inserted_at: :desc])
    end

    # default actions
    create :for_create, primary?: true
  end
end
