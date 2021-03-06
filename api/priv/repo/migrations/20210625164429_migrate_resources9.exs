defmodule PlConnect.Repo.Migrations.MigrateResources9 do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_postgres.generate_migrations`
  """

  use Ecto.Migration

  def up do
    alter table(:users) do
      # Attribute removal has been commented out to avoid data loss. See the migration generator documentation for more
      # If you uncomment this, be sure to also uncomment the corresponding attribute *addition* in the `down` migration
      remove :cod_profile

      add :xbl_cod_profile, :map
      add :psn_cod_profile, :map
    end
  end

  def down do
    alter table(:users) do
      remove :psn_cod_profile
      remove :xbl_cod_profile
      # This is the `down` migration of the statement:
      #
      #     remove :cod_profile
      #

      add :cod_profile, :map
    end
  end
end
