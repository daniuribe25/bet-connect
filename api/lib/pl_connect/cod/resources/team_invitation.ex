defmodule PlConnect.Cod.TeamInvitation do
  @moduledoc """
  Team invitation resource
  """
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [
      AshGraphql.Resource
    ],
    authorizers: [
      AshPolicyAuthorizer.Authorizer
    ]

  import PlConnect.Cod.Resource.Team.Invitation.Changes.AddTeammate, only: [add_teammate: 0]

  alias PlConnect.Cod.User

  alias PlConnect.Cod.Team

  postgres do
    table "teams_invitations"
    repo PlConnect.Repo
  end

  graphql do
    type :team_invitation

    queries do
      list :list_my_invitations, :read
    end

    mutations do
      update :accept_invitation, :accept_invitation
      update :reject_invitation, :reject_invitation
    end
  end

  policies do
    policy action_type(:update) do
      authorize_if relates_to_actor_via(:user)
    end

    policy action_type(:read) do
      authorize_if relates_to_actor_via(:user)
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :status, :atom do
      constraints one_of: [:pending, :accepted, :rejected]

      allow_nil? false

      default :pending
    end

    create_timestamp :inserted_at, private?: false, allow_nil?: true
    update_timestamp :updated_at, private?: false, allow_nil?: true
  end

  relationships do
    belongs_to :user, User
    belongs_to :team, Team
  end

  actions do
    read :read do
      filter user: actor(:id)
    end

    create :create

    update :accept_invitation do
      primary? true
      accept []
      change set_attribute(:status, :accepted)

      change add_teammate()
    end

    update :reject_invitation do
      accept []
      change set_attribute(:status, :rejected)
    end
  end
end
