defmodule PlConnect.Cod.Team.Embedded.Line do
  @moduledoc """
  just a line
  { "level": 1, "goal": 8, "payout": 1.5 }
  """
  use Ash.Resource,
      data_layer: :embedded,
      extensions: [
        AshGraphql.Resource
      ]

  graphql do
    type :team_line
  end

  attributes do
    attribute :level, :integer, allow_nil?: false
    attribute :goal, :integer, allow_nil?: false
    attribute :payout, :float, allow_nil?: false
  end
end