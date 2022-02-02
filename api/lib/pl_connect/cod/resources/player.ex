defmodule PlConnect.Cod.Players do
  @moduledoc """
  Game Images embedded resource module.
  """
  use Ash.Resource,
    data_layer: :embedded,
    extensions: [
      AshGraphql.Resource
    ]

  graphql do
    type :player
  end

  attributes do
    attribute :username, :string

    attribute :platform, :atom do
      constraints one_of: [:psn, :xbl, :battlenet]
    end
  end
end
