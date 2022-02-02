defmodule PlConnect.InviteLobby.User do
  use Ash.Resource,
    data_layer: :embedded,
    extensions: [AshGraphql.Resource]

  attributes do
    attribute :user_id, :uuid

    attribute :status, :atom do
      constraints one_of: [:pending, :joined]
    end
  end
end
