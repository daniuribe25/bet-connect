defmodule PlConnect.Cod.User.Types.PrivateUsers do
  @moduledoc """
  Information of the users with private profile
  """

  use Ash.Resource,
    data_layer: :embedded,
    extensions: [AshGraphql.Resource]

  graphql do
    type :private_users
  end

  attributes do
    attribute :username_platform, :string

    attribute :platform, :atom do
      constraints one_of: [:psn, :xbl, :battlenet]
    end
  end
end
