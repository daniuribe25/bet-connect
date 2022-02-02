defmodule PlConnect.Cod.Team.BetLevelResult do
  @moduledoc """
  Bet levels result
  """

  use Ash.Resource,
    data_layer: :embedded,
    extensions: [
      AshGraphql.Resource
    ]

  graphql do
    type :team_bet_level_result
  end

  attributes do
    attribute :type, :atom do
      constraints one_of: [:main, :kills, :placement, :match, :damage]
      allow_nil? false
    end

    attribute :level, :integer, allow_nil?: true, default: 0
  end
end
