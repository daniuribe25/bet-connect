defmodule PlConnect.InviteLobby do
  use Ash.Resource, data_layer: Ash.DataLayer.Ets

  attributes do
    uuid_primary_key :id
    attribute :leader_id, :uuid
    attribute :metadata, :map
    attribute :users, {:array, PlConnect.InviteLobby.User}, default: []
    create_timestamp :inserted_at
  end

  code_interface do
    define :get_lobbies, action: :read
    define :create_lobby, action: :create
    define :update_users_lobby, action: :update_users, args: [:users]
    define :update_metadata_lobby, action: :update_metadata, args: [:metadata]
    define :destroy_lobby, action: :destroy
  end

  actions do
    read :read
    create :create

    update :update_users do
      primary? true
      accept [:users]
    end

    update :update_metadata do
      accept [:metadata]
    end

    destroy :destroy
  end

  alias PlConnect.Api

  def get_lobby(user_id) do
    lobbies = Api.get_lobbies!()

    Enum.find(lobbies, fn lobby ->
      Enum.find(lobby.users, &(&1.user_id == user_id))
    end)
  end
end
