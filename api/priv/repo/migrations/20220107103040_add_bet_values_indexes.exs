defmodule PlConnect.Repo.Migrations.AddBetValuesIndexes do
  use Ecto.Migration

  def up do
    # Date column indexes - helps sorting
    create_if_not_exists index(:bet_values, :inserted_at)

    # Primary search indices.
    create_if_not_exists index(:bet_values, [
                           :game_mode,
                           :bet_category,
                           :min_kda,
                           :max_kda,
                           :level
                         ])
  end

  def down do
    # Date column indexes - helps sorting
    drop_if_exists index(:bet_values, :inserted_at)

    # Primary search indices.
    drop_if_exists index(:bet_values, [:game_mode, :bet_category, :min_kda, :max_kda, :level])
  end
end
