defmodule PlConnect.Cod.Team.Embedded.Probabilities do
  @moduledoc """
  Team probabilities resource
  """
  use Ash.Resource,
      data_layer: :embedded,
      extensions: [
        AshGraphql.Resource
      ]

  alias PlConnect.Cod.Team.Embedded.BetLine

  graphql do
    type :team_probabilities
  end

  attributes do
    attribute :game_mode, :atom do
      constraints one_of: [:verdansk, :rebirth_island, :caldera]

      allow_nil? false
    end
    attribute :bet_category, :atom do
      constraints one_of: [:rookie, :legend, :diamond]

      allow_nil? false
    end
    attribute :bet_lines, BetLine
  end
end
