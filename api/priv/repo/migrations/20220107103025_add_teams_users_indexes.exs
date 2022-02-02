defmodule PlConnect.Repo.Migrations.AddTeamsUsersIndexes do
  use Ecto.Migration

  def up do
    # Date column indexes - helps sorting
    create_if_not_exists index(:teams_users, :inserted_at)
  end

  def down do
    # Date column indexes - helps sorting
    drop_if_exists index(:teams_users, :inserted_at)
  end
end
