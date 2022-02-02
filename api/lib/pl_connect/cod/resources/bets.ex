defmodule PlConnect.Cod.Bets do
  @moduledoc """
  Bets resource
  """
  use Ash.Resource,
    data_layer: :embedded,
    extensions: [
      AshGraphql.Resource
    ]

  alias PlConnect.Cod.Team.BetPrizes

  graphql do
    type :team_bets
  end

  attributes do
    attribute :rank, {:array, :integer}, allow_nil?: false
    attribute :total_payout, BetPrizes, allow_nil?: false
  end
end
