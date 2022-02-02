defmodule PlConnect.Cod.Bet.UserStat do
  @moduledoc false

  use Ash.Resource,
    data_layer: :embedded,
    extensions: [AshGraphql.Resource]

  graphql do
    type :user_stats
  end

  attributes do
    attribute :user_id, :uuid
    attribute :platform, :atom
    attribute :kills, :integer
    attribute :damage, :integer
    attribute :deaths, :float
    attribute :assists, :float
    attribute :placement, :integer
    attribute :platform_username, :string
    attribute :gulag, :boolean, allow_nil?: true
  end

end
