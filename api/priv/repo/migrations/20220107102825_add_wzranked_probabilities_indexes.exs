defmodule PlConnect.Repo.Migrations.AddWzrankedProbabilitiesIndexes do
  use Ecto.Migration

  def up do
    # Primary search indices.
    create_if_not_exists index(:wzranked_probabilities, :user_id)

    # Date column indexes - helps sorting
    create_if_not_exists index(:wzranked_probabilities, :inserted_at)
  end

  def down do
    # Primary search indices.
    drop_if_exists index(:wzranked_probabilities, :user_id)

    # Date column indexes - helps sorting
    drop_if_exists index(:wzranked_probabilities, :inserted_at)
  end
end
