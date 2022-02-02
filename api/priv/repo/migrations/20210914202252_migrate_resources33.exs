defmodule PlConnect.Repo.Migrations.MigrateResources33 do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_postgres.generate_migrations`
  """

  use Ecto.Migration

  def up do
    alter table(:users) do
      modify :wallet, :map, default: %{funds: 5.0}
      add :flags, :map, null: false, default: %{disallow_bets: false, disallow_deposits: false}
    end
  end

  def down do
    alter table(:users) do
      remove :flags
      modify :wallet, :map, default: %{funds: 100.0}
    end
  end
end