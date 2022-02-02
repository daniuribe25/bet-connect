defmodule PlConnect.Cod.Team do
  @moduledoc """
  Resource for Team realted info
  """
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [
      AshGraphql.Resource,
      AshAdmin.Resource
    ]

  import PlConnect.Cod.Resource.Team.Changes.SavePrivateUsers, only: [save_private_users: 0]
  import PlConnect.Cod.Resource.Team.Changes.ValidateIsActive, only: [validate_is_active: 0]
  import PlConnect.Cod.Resource.Team.Changes.FetchProbabilities, only: [fetch_probabilities: 0]
  import PlConnect.Cod.Resource.Team.Changes.DeleteLobbies, only: [delete_lobbies: 0]
  import PlConnect.Cod.Resource.Team.Changes.LinesSelector, only: [lines_selector: 0]
  import PlConnect.Cod.Resource.Changes.UniqueItemList, only: [unique_item_list: 2]

  alias PlConnect.Cod.User
  alias PlConnect.Cod.Team.{TeamUsers, TeamUsersArgument}
  alias PlConnect.Cod.Team.Embedded.Probabilities
  alias PlConnect.Cod.Team.TeamUsersArgument
  alias PlConnect.Cod.UserBetHistory

  postgres do
    table "teams"
    repo PlConnect.Repo

    references do
      reference :owner, on_delete: :delete
    end
  end

  graphql do
    type :team

    queries do
      list :get_teams, :read
    end

    mutations do
      create :create_team, :create

      update :disband_team, :disband
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :bets, :map, private?: true
    attribute :probabilities, Probabilities
    attribute :probabilities_generated, Probabilities
    attribute :main_bet_level, :integer, allow_nil?: false, default: 0
    attribute :damage_bet_level, :integer, allow_nil?: false, default: 0
    attribute :placement_bet_level, :integer, allow_nil?: false, default: 0
    attribute :is_active, :boolean, allow_nil?: false, default: true
    attribute :use_generated, :boolean, allow_nil?: false, default: false

    attribute :match_map, :atom do
      constraints one_of: [:verdansk, :rebirth_island, :caldera]
      allow_nil? false
      default :verdansk
    end

    attribute :squad_size, :integer, allow_nil?: false, default: 0

    attribute :private_users, {:array, User.Types.PrivateUsers}

    create_timestamp :inserted_at, private?: false, allow_nil?: true
    update_timestamp :updated_at, private?: false, allow_nil?: true
  end

  relationships do
    belongs_to :owner, User

    has_many :teammates, TeamUsers do
      destination_field :team_id
    end

    has_many :bet_history, UserBetHistory do
      destination_field :team_id
    end
  end

  calculations do
    calculate :difficulty, PlConnect.Cod.Team.Embedded.Difficulty, PlConnect.Cod.Team.Calculation.Difficulty, private?: true
    calculate :probabilities_calculated, Probabilities, PlConnect.Cod.Team.Calculation.ProbabilitiesCalculated, select: [:squad_size, :use_generated, :probabilities, :probabilities_generated]
  end

  code_interface do
    define :get_team_by_id, action: :read_by_id, args: [:id], get?: true
    define :get_teams, action: :read
    define :add_team_teammate, action: :add_teammate
    define :create_team, action: :create, args: [:users, :bet_category, :match_map, :squad_size]
    define :set_team_probabilities, action: :set_probabilities
    define :set_team_levels, action: :set_team_levels
    define :disband_team, action: :disband
    define :set_private_users, action: :update_private_users
    define :read_active_team, action: :read_active_team, args: [:user_id], get?: true
  end

  admin do
    read_actions [:read_admin]

    format_fields inserted_at: {PlConnect.Helpers, :format_date, []},
                  updated_at: {PlConnect.Helpers, :format_date, []}
  end

  actions do
    read :read_admin do
      prepare build(sort: [updated_at: :desc])
      pagination default_limit: 20, offset?: true
    end

    read :read, primary?: true

    read :read_active_team do
      argument :user_id, :uuid, allow_nil?: false
      filter expr(owner_id == ^arg(:user_id) and is_active == true)
      prepare build(load: [:teammates])
    end

    read :read_by_id do
      argument :id, :uuid, allow_nil?: false
      filter expr(id == ^arg(:id))
      prepare build(load: [teammates: [:user]])
    end

    create :create do
      accept [:match_map, :squad_size]

      argument :users, {:array, TeamUsersArgument}

      argument :bet_category, :atom do
        constraints one_of: [:rookie, :legend, :diamond]
        allow_nil? false
      end

      metadata :private_users, :map, allow_nil?: false

      change relate_actor(:owner)

      change unique_item_list(:users, :user_id)

      change manage_relationship(:users, :teammates, type: :create)

      change validate_is_active()

      change save_private_users()

      change fetch_probabilities()
    end

    update :add_teammate do
      accept []

      primary? true

      argument :user, TeamUsersArgument

      change manage_relationship(:user, :teammates, type: :create)

      change load(:teammates)

      change fetch_probabilities()
    end

    update :set_probabilities do
      accept [:probabilities, :probabilities_generated]
      change lines_selector()
    end

    update :update_private_users do
      accept [:private_users]
    end

    update :set_team_levels do
      accept [:main_bet_level, :damage_bet_level, :placement_bet_level]
    end

    update :disband do
      accept []
      change set_attribute(:is_active, false)
      change load(:teammates)
      change delete_lobbies()
    end
  end
end
