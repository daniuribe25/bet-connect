defmodule PlConnect.Repo.Migrations.MigrateResources42 do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_postgres.generate_migrations`
  """

  use Ecto.Migration

  def up do
    create table(:wzranked_probabilities, primary_key: false) do
      add :id, :uuid, null: false, primary_key: true
      add :solo_duos, :map
      add :trios, :map
      add :quads, :map
      add :inserted_at, :utc_datetime_usec, default: fragment("now()")

      add :user_id,
          references(:users, column: :id, name: "wzranked_probabilities_user_id_fkey", type: :uuid)
    end
  end

  def down do
    drop constraint(:wzranked_probabilities, "wzranked_probabilities_user_id_fkey")

    drop table(:wzranked_probabilities)
  end
end