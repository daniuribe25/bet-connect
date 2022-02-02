defmodule PlConnect.Cod.PlayerMatch do
  @moduledoc """
  Resource describing the player match, it contains the info required to be sent to the
  """
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshAdmin.Resource]

  alias PlConnect.Helpers
  alias PlConnect.Cod.User

  postgres do
    table "player_matches"
    repo PlConnect.Repo
  end

  admin do
    read_actions [:read_admin, :get_matches, :latest_match, :by_id]

    format_fields id: {Helpers, :id_link_format, []},
                  platform: {Helpers, :element_slug, []},
                  match_map: {Helpers, :element_slug, []},
                  match_type: {Helpers, :element_slug, []},
                  match_teamcomp: {Helpers, :element_slug, []},
                  platform_username: {Helpers, :element_slug, []},
                  platform_username: {Helpers, :element_slug, []},
                  platform_username: {Helpers, :element_slug, []},
                  platform_username: {Helpers, :element_slug, []},
                  match_cod_id: {Helpers, :match_link, []},
                  user_id: {Helpers, :user_link_format, []},
                  match_date: {Helpers, :format_date, []}
  end

  code_interface do
    define :create_player_match, action: :create
    define :update_player_match, action: :update
    define :list_player_matches, action: :read
    define :delete_player_match, action: :destroy
    define :get_player_match, action: :by_id, args: [:id], get?: true
    define :get_user_latest_match, action: :latest_match, args: [:user_id], get?: true

    define :get_user_matches,
      action: :get_matches,
      args: [:user_id, :match_map, :match_teamcomp, :platform]
    define :get_matches_by_cod_id, action: :get_matches_by_cod_id, args: [:match_cod_id]
  end

  identities do
    identity :unique_player_match, [:match_cod_id, :platform_username, :platform]
  end

  attributes do
    integer_primary_key :id

    attribute :match_cod_id, :decimal,
      allow_nil?: false,
      constraints: [min: 0, max: 18_446_744_073_709_551_614]

    attribute :platform_username, :string, allow_nil?: false

    attribute :platform, :atom do
      constraints one_of: [:psn, :xbl, :battlenet]
    end

    attribute :match_map, :atom do
      constraints one_of: [:verdansk, :rebirth_island, :caldera, :unknown]
    end

    attribute :match_type, :atom do
      constraints one_of: [:resurgence, :br, :plunder, :unknown]
    end

    attribute :match_teamcomp, :atom do
      constraints one_of: [:quads, :trios, :duos, :unknown]
    end

    attribute :match_date, :utc_datetime
    attribute :kills, :integer
    attribute :damage, :integer
    attribute :placement, :integer

    attribute :json_response, :map, allow_nil?: false
  end

  relationships do
    belongs_to :user, User
  end

  actions do
    create :create do
      argument :user_id, :uuid, allow_nil?: false

      change manage_relationship(:user_id, :user, type: :append)
    end

    read :read_admin do
      prepare build(sort: [match_date: :desc])
      pagination default_limit: 20, offset?: true
    end

    read :read, primary?: true
    update :update
    destroy :destroy

    read :get_matches do
      argument :user_id, :uuid, allow_nil?: false

      argument :match_map, :atom do
        constraints one_of: [:verdansk, :rebirth_island, :caldera, :unknown]
      end

      argument :match_teamcomp, :atom do
        constraints one_of: [:quads, :trios, :duos, :unknown]
      end

      argument :platform, :atom do
        constraints one_of: [:psn, :xbl, :battlenet]
      end

      filter user_id: arg(:user_id),
             match_map: [in: [:rebirth_island, :verdansk, :caldera]],
             match_teamcomp: arg(:match_teamcomp),
             platform: arg(:platform)
    end

    read :get_matches_by_cod_id do
      argument :match_cod_id, :decimal, allow_nil?: false

      filter expr(match_cod_id == ^arg(:match_cod_id))
    end

    read :latest_match do
      argument :user_id, :uuid, allow_nil?: false

      filter expr(user_id == ^arg(:user_id))

      prepare build(
                sort: [match_date: :desc],
                limit: 1,
                load: [:user]
              )
    end

    read :by_id do
      argument :id, :integer, allow_nil?: false

      filter expr(id == ^arg(:id))

      prepare build(load: [:user])
    end
  end
end
