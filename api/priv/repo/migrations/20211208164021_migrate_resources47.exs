defmodule PlConnect.Repo.Migrations.MigrateResources47 do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_postgres.generate_migrations`
  """

  use Ecto.Migration

  def up do
    alter table(:teams) do
      add :use_generated, :boolean, null: false, default: false
    end
  end

  def down do
    alter table(:teams) do
      remove :use_generated
    end
  end
end