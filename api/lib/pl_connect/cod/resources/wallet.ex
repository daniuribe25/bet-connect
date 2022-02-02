defmodule PlConnect.Cod.Wallet do
  @moduledoc """
  User wallet resource
  """
  use Ash.Resource,
    data_layer: :embedded,
    extensions: [
      AshGraphql.Resource
    ]

  graphql do
    type :wallet
  end

  attributes do
    attribute :funds, :float, allow_nil?: false
  end
end
