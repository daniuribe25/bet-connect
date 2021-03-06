defmodule PlConnect.Repo.Migrations.MigrateResources34 do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_postgres.generate_migrations`
  """

  use Ecto.Migration

  def up do
    alter table(:users_bet_history) do
      add :wlm, :float, default: 1.0
    end

    alter table(:users) do
      add :wlm, :float, default: 1.0, null: false
    end
  end

  def down do
    alter table(:users) do
      remove :wlm
    end

    alter table(:users_bet_history) do
      remove :wlm
    end
  end
end
