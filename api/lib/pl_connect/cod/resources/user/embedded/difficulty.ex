defmodule PlConnect.Cod.User.Embedded.Difficulty do
  @moduledoc false
  use Ash.Resource,
      data_layer: :embedded,
      extensions: [
        AshGraphql.Resource
      ]

  graphql do
    type :user_difficulty
  end

  attributes do
    attribute :main, :map, default: %{factor: 2, reduce: 2, value: 0.0}
    attribute :kills, :map, default: %{factor: 3, reduce: 2, value: 0.0}
    attribute :placement, :map, default: %{factor: 3, reduce: 3, value: 0}
    attribute :damage, :map, default: %{factor: 0.15, reduce: 0.15, value: 0.0}
    attribute :match, :map, default: %{factor: 0.15, reduce: 0.15, value: 0.0}
  end
end