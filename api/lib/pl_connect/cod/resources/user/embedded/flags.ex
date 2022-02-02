defmodule PlConnect.Cod.User.Embedded.Flags do
  @moduledoc """
  betlines
  """
  use Ash.Resource,
      data_layer: :embedded,
      extensions: [
        AshGraphql.Resource
      ]

  graphql do
    type :user_flags
  end

  attributes do
    attribute :disallow_bets, :boolean, default: false
    attribute :disallow_deposits, :boolean, default: false
  end

end
