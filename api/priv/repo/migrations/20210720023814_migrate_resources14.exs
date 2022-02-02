defmodule PlConnect.Repo.Migrations.MigrateResources14 do
  use Ecto.Migration

  def up do
    alter table(:teams) do
      add :is_active, :boolean, allow_nil?: false, default: false
    end
  end

  def down do
    alter table(:teams) do
      remove :is_active
    end
  end
end
