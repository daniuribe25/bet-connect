defmodule PlConnect.Repo.Migrations.AddTeamsInvitationsIndexes do
  use Ecto.Migration

  def up do
    # Date column indexes - helps sorting
    create_if_not_exists index(:teams_invitations, :inserted_at)

    # Foreign key indices.
    create_if_not_exists index(:teams_invitations, :user_id)
    create_if_not_exists index(:teams_invitations, :team_id)
  end

  def down do
    # Date column indexes - helps sorting
    drop_if_exists index(:teams_invitations, :inserted_at)

    # Foreign key indices.
    drop_if_exists index(:teams_invitations, :user_id)
    drop_if_exists index(:teams_invitations, :team_id)
  end
end
