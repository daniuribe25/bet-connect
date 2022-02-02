defmodule PlConnect.Cod.Bet.Stats do
  @moduledoc """
  Values for raw stats we calculation on
  """

  use Ash.Resource,
    data_layer: :embedded,
    extensions: [AshGraphql.Resource]

  graphql do
    type :stats
  end

  attributes do
    attribute :kills, :integer, allow_nil?: false
    attribute :damage, :integer, allow_nil?: false
    attribute :placement, :float, allow_nil?: false
  end
end
