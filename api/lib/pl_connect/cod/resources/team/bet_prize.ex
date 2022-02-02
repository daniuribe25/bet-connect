defmodule PlConnect.Cod.Team.BetPrize do
  @moduledoc """
  Team bet prize (single reward)
  """
  use Ash.Resource,
    data_layer: :embedded,
    extensions: [
      AshGraphql.Resource
    ]

  graphql do
    type :team_bet_prize
  end

  attributes do
    attribute :rookie, :float, allow_nil?: false
    attribute :legend, :float, allow_nil?: false
    attribute :diamond, :float, allow_nil?: false
  end
end
