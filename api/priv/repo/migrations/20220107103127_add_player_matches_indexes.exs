defmodule PlConnect.Repo.Migrations.AddPlayerMatchesIndexes do
  use Ecto.Migration

  def up do
    # Primary search indices.
    create_if_not_exists index(:player_matches, :user_id)
    create_if_not_exists index(:player_matches, :match_cod_id)

    create_if_not_exists index(:player_matches, [:user_id, :match_map, :match_teamcomp, :platform])

    # Date column indexes - helps sorting
    create_if_not_exists index(:player_matches, :match_date)
  end

  def down do
    # Primary search indices.
    drop_if_exists index(:player_matches, :user_id)
    drop_if_exists index(:player_matches, :match_cod_id)
    drop_if_exists index(:player_matches, [:user_id, :match_map, :match_teamcomp, :platform])

    # Date column indexes - helps sorting
    drop_if_exists index(:player_matches, :match_date)
  end
end
