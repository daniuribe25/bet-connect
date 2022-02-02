defmodule PlConnect.Cod.BetValues do
  @moduledoc """
  User resource
  """
  use Ash.Resource,
      data_layer: AshPostgres.DataLayer,
      extensions: [
        AshGraphql.Resource,
        AshAdmin.Resource
      ]

  alias PlConnect.Helpers

  postgres do
    table "bet_values"
    repo PlConnect.Repo
  end

  admin do
    read_actions [:read, :read_rookie, :read_legend, :read_diamond]

    table_columns [
      :game_mode,
      :bet_category,
      :type,
      :level,
      :goal,
      :payout,
      :min_kda,
      :max_kda,
    ]

    format_fields payout: {Helpers, :money_format, []}
  end

  graphql do
    type :bet_values

    mutations do
      create :create_bet_values, :create
      update :update_bet_values, :update
      update :destroy_bet_values, :destroy
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :game_mode, :atom do
      constraints one_of: [:verdansk, :rebirth_island, :caldera]

      allow_nil? false
    end
    attribute :bet_category, :atom do
      constraints one_of: [:rookie, :legend, :diamond]

      allow_nil? false
    end
    attribute :type, :atom do
      constraints one_of: [:main, :kills, :placement, :damage, :match]

      allow_nil? false
    end

    attribute :level, :integer, allow_nil?: false, default: 1
    attribute :goal, :integer, allow_nil?: false, default: 1
    attribute :payout, :float, allow_nil?: false, default: 1.0
    attribute :min_kda, :float, allow_nil?: false, default: 1.0
    attribute :max_kda, :float, allow_nil?: false, default: 1.0

    create_timestamp :inserted_at, private?: false, allow_nil?: true
    update_timestamp :updated_at, private?: false, allow_nil?: true
  end

  code_interface do
    define :create_bet_values, action: :create
    define :get_bet_values, action: :bet_modes, args: [:game_mode, :bet_category, :kda]
  end

  actions do
    read :read do
      primary? true
      prepare build(sort: [game_mode: :desc, level: :asc, bet_category: :asc])
    end

    read :read_rookie do
      prepare build(sort: [game_mode: :desc, level: :asc, bet_category: :asc])
      filter expr(bet_category == :rookie)
    end

    read :read_legend do
      prepare build(sort: [game_mode: :desc, level: :asc, bet_category: :asc])
      filter expr(bet_category == :legend)
    end

    read :read_diamond do
      prepare build(sort: [game_mode: :desc, level: :asc, bet_category: :asc])
      filter expr(bet_category == :diamond)
    end

    read :bet_modes do
      argument :game_mode, :atom
      argument :bet_category, :atom
      argument :kda, :float
      filter expr(game_mode == ^arg(:game_mode) and bet_category == ^arg(:bet_category) and
                  fragment("? BETWEEN ? AND ?", ^arg(:kda), min_kda, max_kda))
      prepare build(sort: [level: :asc])
    end

    create :create
    update :update
    destroy :destroy
  end

end