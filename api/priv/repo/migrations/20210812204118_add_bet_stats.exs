defmodule PlConnect.Repo.Migrations.AddBetStats do
  use Ecto.Migration

  def change do
    alter table(:users_bet_history) do
      add :stats, :map
    end
  end
end
