defmodule PlConnect.Repo.Migrations.AddUsersIndexes do
  use Ecto.Migration

  def up do
    # Postgres needs the btree_gist extension enabled for GIN indexing to
    execute "CREATE EXTENSION IF NOT EXISTS pg_trgm"
    execute "CREATE EXTENSION IF NOT EXISTS btree_gist"

    # Date column indexes - helps sorting
    create_if_not_exists index(:users, :inserted_at)
    create_if_not_exists index(:users, :updated_at)

    # GIN indexes - to enable fast ILIKE queries
    create_if_not_exists index(:users, ["(to_tsvector('english', xbl_platform_username))"],
                           using: "GIN",
                           name: :users_xbl_platform_username_vector
                         )

    create_if_not_exists index(:users, ["(to_tsvector('english', psn_platform_username))"],
                           using: "GIN",
                           name: :users_psn_platform_username_vector
                         )

    create_if_not_exists index(:users, ["(to_tsvector('english', email))"],
                           using: "GIN",
                           name: :users_email_vector
                         )

    create_if_not_exists index(:users, ["(to_tsvector('english', phone))"],
                           using: "GIN",
                           name: :users_phone_vector
                         )
  end

  def down do
    # Date column indexes - helps sorting
    drop_if_exists index(:users, :inserted_at)
    drop_if_exists index(:users, :updated_at)

    # GIN indexes - to enable fast ILIKE queries
    drop_if_exists index(:users, [:xbl_platform_username],
                     name: :users_xbl_platform_username_vector
                   )

    drop_if_exists index(:users, [:psn_platform_username],
                     name: :users_psn_platform_username_vector
                   )

    drop_if_exists index(:users, [:email], name: :users_email_vector)
    drop_if_exists index(:users, [:phone], name: :users_phone_vector)
  end
end
