defmodule PlConnect.Repo.Migrations.MigrateResources44 do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_postgres.generate_migrations`
  """

  use Ecto.Migration

  def up do
    rename table(:wzranked_probabilities), :solo_duos, to: :verdansk_solo_duos

    rename table(:wzranked_probabilities), :trios, to: :verdansk_trios

    rename table(:wzranked_probabilities), :quads, to: :verdansk_quads

    alter table(:wzranked_probabilities) do
      # Attribute removal has been commented out to avoid data loss. See the migration generator documentation for more
      # If you uncomment this, be sure to also uncomment the corresponding attribute *addition* in the `down` migration
      # remove :season

      add :rebirth_island_solo_duos, :map
      add :rebirth_island_trios, :map
      add :rebirth_island_quads, :map
    end
  end

  def down do
    alter table(:wzranked_probabilities) do
      remove :rebirth_island_quads
      remove :rebirth_island_trios
      remove :rebirth_island_solo_duos
      # This is the `down` migration of the statement:
      #
      #     remove :season
      #

      # add :season, :text
    end

    rename table(:wzranked_probabilities), :verdansk_quads, to: :quads

    rename table(:wzranked_probabilities), :verdansk_trios, to: :trios

    rename table(:wzranked_probabilities), :verdansk_solo_duos, to: :solo_duos
  end
end