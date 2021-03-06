defmodule PlConnect.Repo.Migrations.MigrateResources10 do
  @moduledoc """
  Updates resources based on their most recent snapshots.

  This file was autogenerated with `mix ash_postgres.generate_migrations`
  """

  use Ecto.Migration

  def up do
    create table(:users_bet_history, primary_key: false) do
      add :owner_id,
          references(:users, column: :id, name: "users_bet_history_owner_id_fkey", type: :uuid)

      add :team_id,
          references(:teams, column: :id, name: "users_bet_history_team_id_fkey", type: :uuid)

      add :id, :uuid, null: false, primary_key: true
      add :bet_total_amount, :float
      add :status, :text, null: false, default: "waiting"
      add :map, :text, null: false
      add :bet_format, :text, null: false
      add :bets_level_result, {:array, :map}
      add :required_result, {:array, :map}
      add :inserted_at, :utc_datetime_usec, default: fragment("now()")
      add :updated_at, :utc_datetime_usec, default: fragment("now()")
    end
  end

  def down do
    drop table(:users_bet_history)
  end
end
