defmodule PlConnect.Cod.RebirthLine do
  @moduledoc """
  Resource for save the transactions of the Bets
  """
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer

  postgres do
    table "rebirth_lines"
    repo PlConnect.Repo
  end

  attributes do
    uuid_primary_key :id

    attribute :mean_kills_sum, :float, allow_nil?: true, default: 1

    attribute :advantage, :atom do
      constraints one_of: [:player, :neutral, :house, :unknown]
      allow_nil? false
    end

    attribute :team_size, :atom do
      constraints one_of: [:duos, :trios, :quads, :unknown]
      allow_nil? false
    end

    attribute :kills_bet_1, :integer, allow_nil?: true, default: 1
    attribute :kills_bet_2, :integer, allow_nil?: true, default: 1
    attribute :kills_bet_3, :integer, allow_nil?: true, default: 1
    attribute :payout_bet_1, :float, allow_nil?: true, default: 1
    attribute :payout_bet_2, :float, allow_nil?: true, default: 1
    attribute :payout_bet_3, :float, allow_nil?: true, default: 1

    attribute :version, :string, allow_nil?: true, default: "1.0"

    create_timestamp :inserted_at, private?: false, allow_nil?: true
  end

  code_interface do
    define :get_rebirth_line, action: :read_by_version, args: [:mean_kills_sum, :team_size, :version], get?: true
    define :create_rebirth_line, action: :create
  end

  actions do
    read :read_by_version do
      argument :mean_kills_sum, :float, allow_nil?: true
      argument :team_size, :atom do
        constraints one_of: [:duos, :trios, :quads]
      end
      argument :version, :string, allow_nil?: true

      filter expr(version == ^arg(:version) and mean_kills_sum <= ^arg(:mean_kills_sum))
      prepare build(limit: 1, sort: [mean_kills_sum: :desc])
    end

    create :create
  end
end
