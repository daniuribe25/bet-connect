defmodule PlConnect.Repo.Migrations.AddUsersBetHistoryIndexes do
  use Ecto.Migration

  def up do
    # Foreign key & primary search indices.
    create_if_not_exists index(:users_bet_history, [:owner_id, :status])
    create_if_not_exists index(:users_bet_history, [:team_id, :status])

    # Date column indexes - helps sorting
    create_if_not_exists index(:users_bet_history, :inserted_at)
    create_if_not_exists index(:users_bet_history, :updated_at)
  end

  def down do
    # Foreign key & primary search indices.
    drop_if_exists index(:user_events_info, [:owner_id, :status])
    drop_if_exists index(:user_events_info, [:team_id, :status])

    # Date column indexes - helps sorting
    drop_if_exists index(:users_bet_history, :inserted_at)
    drop_if_exists index(:users_bet_history, :updated_at)
  end
end
