defmodule PlConnect.Cod.Bet.LobbyStats do
  @moduledoc false

  use Ash.Resource,
      data_layer: :embedded,
      extensions: [AshGraphql.Resource]

  graphql do
    type :lobby_stats
  end

  attributes do
    attribute :kda, :float
    attribute :kills, :float
    attribute :time_alive, :float
  end
end