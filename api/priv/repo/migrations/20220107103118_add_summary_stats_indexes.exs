defmodule PlConnect.Repo.Migrations.AddSummaryStatsIndexes do
  use Ecto.Migration

  def up do
    # Primary search indices.
    create_if_not_exists index(:summary_stats, [:start_range, :end_range])

    # Date column indexes - helps sorting
    create_if_not_exists index(:summary_stats, :inserted_at)
  end

  def down do
    # Primary search indices.
    drop_if_exists index(:summary_stats, [:start_range, :end_range])

    # Date column indexes - helps sorting
    drop_if_exists index(:summary_stats, :inserted_at)
  end
end
