defmodule PlConnect.Cod.Team.BetPrizes do
  @moduledoc """
  Team bet prizes
  """
  use Ash.Resource,
    data_layer: :embedded,
    extensions: [
      AshGraphql.Resource
    ]

  graphql do
    type :team_bet_prizes
  end

  attributes do
    attribute :rookie, {:array, :float}, allow_nil?: false
    attribute :legend, {:array, :float}, allow_nil?: false
    attribute :diamond, {:array, :float}, allow_nil?: false
  end
end
