defmodule PlConnect.Cod.Team.BetLevelRequirement do
  @moduledoc """
  Representing the value of a bet and the bet amount of the given level
  """

  use Ash.Resource,
    data_layer: :embedded,
    extensions: [
      AshGraphql.Resource
    ]

  graphql do
    type :user_bet_level_requirement
  end

  attributes do
    attribute :type, :atom do
      constraints one_of: [:main, :kills, :placement, :match, :damage]
      allow_nil? false
    end

    attribute :value, :float, allow_nil?: false

    attribute :bet_amount, :float, allow_nil?: false

    attribute :rewarded_amount, :float, allow_nil?: false

    attribute :won, :boolean, allow_nil?: false, default: false
  end
end
