defmodule PlConnect.Cod.Team.Embedded.BetLine do
  @moduledoc false
  use Ash.Resource,
      data_layer: :embedded,
      extensions: [
        AshGraphql.Resource
      ]

  alias PlConnect.Cod.Team.Embedded.Line

  graphql do
    type :team_bet_line
  end

  attributes do
    attribute :main, {:array, Line}, allow_nil?: true
    attribute :kills, {:array, Line}, allow_nil?: true
    attribute :placement, {:array, Line}, allow_nil?: true
    attribute :damage, {:array, Line}, allow_nil?: true
    attribute :match, {:array, Line}, allow_nil?: true
  end
end