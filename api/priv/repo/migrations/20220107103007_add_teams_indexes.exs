defmodule PlConnect.Repo.Migrations.AddTeamsIndexes do
  use Ecto.Migration

  def up do
    # Primary search indices.
    create_if_not_exists index(:teams, [:owner_id, :is_active])

    # Date column indexes - helps sorting
    create_if_not_exists index(:teams, :inserted_at)
    create_if_not_exists index(:teams, :updated_at)
  end

  def down do
    # Date column indexes - helps sorting
    drop_if_exists index(:teams, :inserted_at)
    drop_if_exists index(:teams, :updated_at)

    # Primary search indices.
    drop_if_exists index(:teams, [:owner_id, :is_active])
  end
end
