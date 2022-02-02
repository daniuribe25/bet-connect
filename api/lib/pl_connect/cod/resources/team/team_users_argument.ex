defmodule PlConnect.Cod.Team.TeamUsersArgument do
  @moduledoc """
  Users and teams many to many relationship
  """

  use Ash.Resource,
    data_layer: :embedded,
    extensions: [
      AshGraphql.Resource
    ]

  graphql do
    type :team_users_argument
  end

  attributes do
    attribute :lobby_platform, :atom do
      constraints one_of: [:psn, :xbl, :battlenet]
      allow_nil? false
    end

    attribute :user_id, :uuid, allow_nil?: false
  end
end
