defmodule PlConnect.Cod.Team.Embedded.Difficulty do
  @moduledoc false
  use Ash.Resource,
      data_layer: :embedded,
      extensions: [AshGraphql.Resource]

  graphql do
    type :team_difficulty
  end

  attributes do
    attribute :main, :float, default: 0.0
    attribute :kills, :float, default: 0.0
    attribute :placement, :float, default: 0.0
    attribute :damage, :float, default: 0.0
    attribute :match, :float, default: 0.0
  end
end