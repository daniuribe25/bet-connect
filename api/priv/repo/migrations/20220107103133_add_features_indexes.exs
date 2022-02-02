defmodule PlConnect.Repo.Migrations.AddFeaturesIndexes do
  use Ecto.Migration

  def up do
    # Primary search indices.
    create_if_not_exists index(:features, [:domain, :is_enabled])

    # Date column indexes - helps sorting
    create_if_not_exists index(:features, :inserted_at)
    create_if_not_exists index(:features, :updated_at)
  end

  def down do
    # Primary search indices.
    drop_if_exists index(:features, [:domain, :is_enabled])

    # Date column indexes - helps sorting
    drop_if_exists index(:features, :inserted_at)
    drop_if_exists index(:features, :updated_at)
  end
end
