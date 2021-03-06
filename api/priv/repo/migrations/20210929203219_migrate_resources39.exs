defmodule PlConnect.Repo.Migrations.MigrateResources39 do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_postgres.generate_migrations`
  """

  use Ecto.Migration

  def up do
    alter table(:users_bet_history) do
      # Attribute removal has been commented out to avoid data loss. See the migration generator documentation for more
      # If you uncomment this, be sure to also uncomment the corresponding attribute *addition* in the `down` migration
      # remove :wlm

      add :difficulty, :map
    end

    alter table(:users) do
      # Attribute removal has been commented out to avoid data loss. See the migration generator documentation for more
      # If you uncomment this, be sure to also uncomment the corresponding attribute *addition* in the `down` migration
      # remove :wlm

      modify :flags, :map, default: %{disallow_bets: false, disallow_deposits: false}
      modify :wallet, :map, default: %{funds: 25.0}

      add :difficulty, :map,
        null: false,
        default: %{
          damage: %{factor: 0.15, value: 0.0},
          kills: %{factor: 1, value: 0.0},
          main: %{factor: 1, value: 0.0},
          match: %{factor: 0.15, value: 0.0},
          placement: %{factor: 1, value: 0.0}
        }
    end
  end

  def down do
    alter table(:users) do
      remove :difficulty
      modify :wallet, :map, default: %{funds: 5.0}

      modify :flags, :map,
        default: %{disallow_bets: false, disallow_deposits: false, multiply_factor: 0.15}

      # This is the `down` migration of the statement:
      #
      #     remove :wlm
      #

      # add :wlm, :float, null: false
    end

    alter table(:users_bet_history) do
      remove :difficulty
      # This is the `down` migration of the statement:
      #
      #     remove :wlm
      #

      # add :wlm, :float
    end
  end
end