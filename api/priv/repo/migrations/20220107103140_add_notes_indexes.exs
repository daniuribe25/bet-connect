defmodule PlConnect.Repo.Migrations.AddNotesIndexes do
  use Ecto.Migration

  def up do
    # Foreign Key & Primary search indices.
    create_if_not_exists index(:notes, :user_id)
    create_if_not_exists index(:notes, :bet_history_id)

    # Date column indexes - helps sorting
    create_if_not_exists index(:notes, :inserted_at)
  end

  def down do
    # Foreign Key & Primary search indices.
    drop_if_exists index(:notes, :user_id)
    drop_if_exists index(:notes, :bet_history_id)

    # Date column indexes - helps sorting
    drop_if_exists index(:notes, :inserted_at)
  end
end
