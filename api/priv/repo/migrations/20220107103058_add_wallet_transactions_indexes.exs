defmodule PlConnect.Repo.Migrations.AddWalletTransactionsIndexes do
  use Ecto.Migration

  def up do
    # Foreign key & primary search indices.
    create_if_not_exists index(:wallet_transactions, [:bet_history_id, :type, :status])
    create_if_not_exists index(:wallet_transactions, [:team_id, :type, :status])
    create_if_not_exists index(:wallet_transactions, [:user_id, :type, :status])

    # Date column indexes - helps sorting
    create_if_not_exists index(:wallet_transactions, :inserted_at)
  end

  def down do
    # Foreign key & primary search indices.
    drop_if_exists index(:wallet_transactions, [:bet_history_id, :type, :status])
    drop_if_exists index(:wallet_transactions, [:team_id, :type, :status])
    drop_if_exists index(:wallet_transactions, [:user_id, :type, :status])

    # Date column indexes - helps sorting
    drop_if_exists index(:wallet_transactions, :inserted_at)
  end
end
