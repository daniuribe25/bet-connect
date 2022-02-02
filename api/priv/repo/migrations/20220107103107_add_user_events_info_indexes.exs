defmodule PlConnect.Repo.Migrations.AddUserEventsInfoIndexes do
  use Ecto.Migration

  def up do
    # Foreign key & primary search indices.
    create_if_not_exists index(:user_events_info, [:user_id, :event_name, :value])

    # Date column indexes - helps sorting
    create_if_not_exists index(:user_events_info, :inserted_at)
  end

  def down do
    # Foreign key & primary search indices.
    drop_if_exists index(:user_events_info, [:user_id, :event_name, :value])

    # Date column indexes - helps sorting
    drop_if_exists index(:user_events_info, :inserted_at)
  end
end
