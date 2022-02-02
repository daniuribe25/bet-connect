defmodule PlConnect.Cod.Team.TeamUsers do
  @moduledoc """
  Users and teams many to many relationship
  """

  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [
      AshGraphql.Resource
    ]

  alias PlConnect.Cod.Team
  alias PlConnect.Cod.User

  postgres do
    table "teams_users"
    repo PlConnect.Repo

    references do
      reference :team, on_delete: :delete
      reference :user, on_delete: :delete
    end
  end

  graphql do
    type :team_users
  end

  attributes do
    uuid_primary_key :id

    attribute :lobby_platform, :atom do
      constraints one_of: [:psn, :xbl, :battlenet]
      allow_nil? false
    end

    create_timestamp :inserted_at, private?: false
  end

  relationships do
    belongs_to :team, Team
    belongs_to :user, User
  end

  actions do
    create :create do
      argument :user_id, :uuid

      change manage_relationship(:user_id, :user, type: :replace)
    end
  end

  identities do
    identity :unique_teams_users, [:team_id, :user_id]
  end
end
