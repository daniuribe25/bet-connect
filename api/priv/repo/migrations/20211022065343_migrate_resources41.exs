defmodule PlConnect.Repo.Migrations.MigrateResources41 do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_postgres.generate_migrations`
  """

  use Ecto.Migration

  def up do
    alter table(:teams) do
      add :probabilities_generated, :map
    end
  end

  def down do
    alter table(:teams) do
      remove :probabilities_generated
    end
  end
end