defmodule PlConnect.Cod.User do
  @moduledoc """
  User resource
  """
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [
      AshGraphql.Resource,
      AshAdmin.Resource
    ]

  require Ash.Query

  import PlConnect.Cod.Resource.Changes.UserExist, only: [user_platform_exist: 0]
  import PlConnect.Cod.Resource.Changes.HashPassword, only: [hash_password: 0]
  import PlConnect.Cod.Resource.Changes.Lowercase, only: [lowercase: 1]
  import PlConnect.Cod.Resource.Changes.User.SetTempFields, only: [set_temp_fields: 0]
  import PlConnect.Cod.Resource.Changes.User.QueueInsertMatches, only: [queue_insert_matches: 0]
  import PlConnect.Cod.Resource.Changes.User.DeactivatePastTeams, only: [deactivate_past_teams: 0]
  import PlConnect.Cod.Resource.Changes.UpdateInnerAttribute, only: [update_inner_attribute: 4]
  import PlConnect.Cod.Resource.Changes.User.ProfileVerification, only: [profile_verification: 1]
  import PlConnect.Cod.Resource.Changes.User.UpdateDifficulty, only: [update_difficulty: 3]
  import PlConnect.Cod.Resource.Changes.User.NextStep, only: [next_step: 1]
  import PlConnect.Cod.Resource.Changes.User.ResetPassword, only: [reset_password: 0]

  import PlConnect.Cod.Resource.Changes.User.PaypalTransactionProcess,
    only: [paypal_transaction_process: 0]

  alias PlConnect.Cod.{Team, Team.TeamUsers, Wallet, UserCodProfile, PlayerMatch}

  postgres do
    table "users"
    repo PlConnect.Repo
  end

  admin do
    form do
      table_columns [
        :id,
        :xbl_platform_username,
        :psn_platform_username,
        :email,
        :phone,
        :wallet,
        :inserted_at,
        :updated_at
      ]
    end

    format_fields inserted_at: {PlConnect.Helpers, :format_date, []},
                  updated_at: {PlConnect.Helpers, :format_date, []}
  end

  graphql do
    type :user

    queries do
      get :get_user_xbl, :read, identity: :unique_xbl_platform_username
      get :get_user_psn, :read, identity: :unique_psn_platform_username
      get :get_user_battlenet, :read, identity: :unique_battlenet_platform_username
      read_one :current_user, :current_user

      read_one :get_user_by_phone, :by_phone
      read_one :get_user_by_email, :by_email
      list :get_by_gamer_tag, :by_gamer_tag
      list :list_users, :read
    end

    mutations do
      create :create_user, :create

      create :create_account_step_one, :create_by_phone_or_email
      update :create_account_step_two, :create_username_by_id
      update :create_account_step_three, :create_password_by_id
      update :update_profile_status, :update_profile_status

      destroy :destroy_user, :destroy
      update :update_user_profile, :update_profile
      update :update_user_password, :update_user_password
      update :admin_update_user_password, :admin_update_user_password
      update :disable_user_teams, :disable_teams
      update :paypal_transaction_process, :paypal_transaction_process
      update :update_user_flag, :update_flag
      update :reset_password, :reset_password
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :wzranked_uno, :string, allow_nil?: true
    attribute :private_profile, :boolean

    attribute :first_name, :string, allow_nil?: true
    attribute :last_name, :string, allow_nil?: true
    attribute :nationality, :string, allow_nil?: true
    attribute :gender, :string, allow_nil?: true

    attribute :password_hash, :string, allow_nil?: false, private?: true, sensitive?: true
    attribute :age_verified, :boolean, default: false
    attribute :refresh_berbix_token, :string, allow_nil?: true, sensitive?: false, default: nil
    attribute :berbix_transaction_id, :string, allow_nil?: true, sensitive?: false, default: nil

    attribute :date_of_birth, :string, allow_nil?: true, sensitive?: false, default: nil
    attribute :family_name, :string, allow_nil?: true, sensitive?: false, default: nil
    attribute :given_name, :string, allow_nil?: true, sensitive?: false, default: nil
    attribute :middle_name, :string, allow_nil?: true, sensitive?: false, default: nil
    attribute :verified_document, :string, allow_nil?: true, sensitive?: false, default: nil

    attribute :xbl_platform_username, :string, sensitive?: true
    attribute :psn_platform_username, :string, sensitive?: true
    attribute :battlenet_platform_username, :string, sensitive?: true

    attribute :email, :string, allow_nil?: false, sensitive?: true

    attribute :phone, :string do
      sensitive? true
      constraints min_length: 8, max_length: 14
    end

    attribute :wallet, Wallet,
      sensitive?: true,
      allow_nil?: false,
      default: %{funds: 25.0}

    attribute :xbl_cod_profile, UserCodProfile, private?: true
    attribute :psn_cod_profile, UserCodProfile, private?: true
    attribute :battlenet_cod_profile, UserCodProfile, private?: true

    attribute :flags, PlConnect.Cod.User.Embedded.Flags, allow_nil?: false,
      default: %{
        disallow_bets: false,
        disallow_deposits: false
      }

    attribute :difficulty, PlConnect.Cod.User.Embedded.Difficulty, allow_nil?: false,
      default: %{
        main: %{factor: 2, reduce: 2, value: 0},
        kills: %{factor: 3, reduce: 2, value: 0},
        placement: %{factor: 3, reduce: 3, value: 0},
        damage: %{factor: 0.15, reduce: 0.15, value: 0.0},
        match: %{factor: 0.15, reduce: 0.15, value: 0.0}
      }

    attribute :pl_core_user_id, :string, allow_nil?: true, sensitive?: true

    attribute :step_register, :atom do
      constraints one_of: [:step_1, :step_2, :step_3]
      allow_nil? false
      default :step_1
    end

    create_timestamp :inserted_at, private?: false, allow_nil?: true
    update_timestamp :updated_at, private?: false, allow_nil?: true
  end

  relationships do
    has_many :owned_teams, Team do
      destination_field :owner_id
    end

    has_many :teams, TeamUsers do
      destination_field :user_id
    end

    has_many :matches, PlayerMatch do
      destination_field :user_id
    end
  end

  aggregates do
    count :matches_count, :matches
  end

  identities do
    identity :unique_phone, [:phone]
    identity :unique_email, [:email]
    identity :unique_xbl_platform_username, [:xbl_platform_username]
    identity :unique_psn_platform_username, [:psn_platform_username]
    identity :unique_battlenet_platform_username, [:battlenet_platform_username]
  end

  validations do
    #    validate match(:phone, ~r/^(\++?\d{1,3})(\d{10})$/, "is not valid phone") # to validate country code at start
    # validate match(:phone, ~r/^(\d{10})$/, "is not valid phone") # just the XXXXXXXXXX format
    validate match(:email, ~r/^[^\s]+@[^\s]+$/, "must have the @ sign and no spaces")
  end

  code_interface do
    define :current_user, action: :current_user, args: [:id]
    define :create_user, action: :create
    define :list_users, action: :read
    define :delete_user, action: :destroy
    define :get_user, action: :by_id, args: [:id], get?: true
    define :update_update_profile, action: :update_profile
    define :update_user_wallet, action: :update_wallet
    define :update_user_process_data, action: :update_process_data
    define :update_user_age_verified, action: :update_age_verified
    define :update_user_verified, action: :update_verified
    define :update_berbix_data, action: :update_berbix_token, args: [:refresh_token, :transaction_id]
    define :create_user_platform_bypass, action: :create_platform_bypass
    define :update_user_xbl_cod_profile, action: :update_xbl_cod_profile
    define :update_user_psn_cod_profile, action: :update_psn_cod_profile
    define :update_user_battlenet_cod_profile, action: :update_battlenet_cod_profile
    define :paypal_transaction_process,
      action: :paypal_transaction_process,
      args: [:order_id, :authorization_id]
    define :update_user_flag, action: :update_flag, args: [:flag, :value, :type]
    define :update_user_difficulty_value, action: :update_difficulty_value, args: [:line, :value]
    define :update_user_difficulty_factor, action: :update_difficulty_factor, args: [:line, :value]

    define :create_user_by_phone, action: :create_by_phone_or_email
    define :create_username_by_id, action: :create_username_by_id
    define :create_password_by_id, action: :create_password_by_id
    define :get_user_by_phone, action: :by_phone, args: [:phone], get?: true
    define :get_user_by_email, action: :by_email, args: [:email], get?: true
    define :approve_account, action: :approve_account
    define :update_profile_status, action: :update_profile_status
    define :update_wzranked_uno, action: :update_wzranked_uno, args: [:wzranked_uno]
  end

  actions do
    read :read, primary?: true, pagination: [offset?: true, keyset?: true, required?: false]

    read :by_id do
      argument :id, :uuid, allow_nil?: false

      filter expr(id == ^arg(:id))
    end

    read :by_phone do
      argument :phone, :string, allow_nil?: false
      filter expr(phone == ^arg(:phone))
    end

    read :by_email do
      argument :email, :string, allow_nil?: false
      filter expr(email == ^arg(:email))
    end

    read :by_gamer_tag do
      argument :username, :string, sensitive?: false, allow_nil?: false
      prepare PlConnect.Cod.Resource.Prepares.SearchByGamerTag
    end

    read :current_user, filter: expr(id == ^actor(:id))

    create :create do
      accept [:email, :phone, :xbl_platform_username, :psn_platform_username, :battlenet_platform_username, :pl_core_user_id]

      primary? true

      argument :password, :string,
        allow_nil?: false,
        constraints: [
          max_length: 80,
          min_length: 8
        ]

      argument :password_confirmation, :string, allow_nil?: false

      validate confirm(:password, :password_confirmation)

      change lowercase(:email)

      change user_platform_exist()
      change hash_password()

      change queue_insert_matches()
    end

    # step 1
    create :create_by_phone_or_email do
      accept []

      argument :email, :string
      argument :phone, :string

      change set_temp_fields()
    end

    create :create_platform_bypass do
      accept [:email, :phone, :xbl_platform_username, :psn_platform_username, :battlenet_platform_username, :pl_core_user_id]

      argument :password, :string,
        allow_nil?: false,
        constraints: [
          max_length: 80,
          min_length: 8
        ]

      argument :password_confirmation, :string, allow_nil?: false

      validate confirm(:password, :password_confirmation)

      change lowercase(:email)

      change hash_password()
    end

    update :update_profile do
      accept [:phone]
    end

    # step 2
    update :create_username_by_id do
      accept [:xbl_platform_username, :psn_platform_username, :battlenet_platform_username]

      change next_step(:step_2)
      change queue_insert_matches()
    end

    # step 3
    update :create_password_by_id do
      accept []

      argument :password, :string,
        allow_nil?: false,
        constraints: [
          max_length: 80,
          min_length: 8
        ]

      validate PlConnect.Cod.User.Validations.ValidateCreatePasswordById
      change hash_password()
      change next_step(:step_3)
      change profile_verification(true)
    end

    update :approve_account do
      accept []
      change set_attribute(:step_register, :step_3)
    end

    update :update_user_password do
      primary? true
      accept []

      argument :current_password, :string, allow_nil?: false

      argument :password, :string,
        allow_nil?: false,
        constraints: [
          max_length: 80,
          min_length: 8
        ]

      argument :password_confirmation, :string, allow_nil?: false

      validate confirm(:password, :password_confirmation)
      validate PlConnect.Cod.User.Validations.ValidateCurrentPassword

      change hash_password()
    end

    update :admin_update_user_password do
      accept []

      argument :password, :string,
        allow_nil?: false,
        constraints: [
          max_length: 80,
          min_length: 8
        ]

      argument :password_confirmation, :string, allow_nil?: false

      validate confirm(:password, :password_confirmation)

      change hash_password()
    end

    update :update_wallet do
      accept [:wallet]
    end

    update :update_process_data do
      accept [:wallet, :difficulty]
    end

    update :update_age_verified do
      accept [:age_verified]
    end

    update :update_verified do
      accept [:date_of_birth, :family_name, :given_name, :middle_name, :verified_document]
    end

    update :update_berbix_token do
      argument :refresh_token, :string, allow_nil?: false
      argument :transaction_id, :string, allow_nil?: false
      change set_attribute(:refresh_berbix_token, {:arg, :refresh_token})
      change set_attribute(:berbix_transaction_id, {:arg, :transaction_id})
    end

    update :update_xbl_cod_profile do
      argument :cod_profile, :map

      change set_attribute(:xbl_cod_profile, {:arg, :cod_profile})
    end

    update :update_psn_cod_profile do
      argument :cod_profile, :map

      change set_attribute(:psn_cod_profile, {:arg, :cod_profile})
    end

    update :update_battlenet_cod_profile do
      argument :cod_profile, :map

      change set_attribute(:battlenet_cod_profile, {:arg, :cod_profile})
    end

    update :disable_teams do
      change deactivate_past_teams()
    end

    update :paypal_transaction_process do
      argument :order_id, :string
      argument :authorization_id, :string

      change paypal_transaction_process()
    end

    update :update_flag do
      argument :flag, :atom do
        constraints one_of: [:disallow_bets, :disallow_deposits]
      end
      argument :value, :string
      argument :type, :atom do
        constraints one_of: [:string, :atom, :float, :integer, :boolean]
      end
      change update_inner_attribute(:flags, {:arg, :flag}, {:arg, :value}, {:arg, :type})
    end

    update :update_difficulty_factor do
      accept []
      argument :line, :atom
      argument :value, :float
      change update_difficulty({:arg, :line}, "factor", {:arg, :value})
    end

    update :update_difficulty_value do
      accept []
      argument :line, :atom
      argument :value, :float
      change update_difficulty({:arg, :line}, "value", {:arg, :value})
    end

    update :update_profile_status do
      accept []
      change profile_verification(false)
    end

    update :update_wzranked_uno do
      accept []
      argument :wzranked_uno, :string
      change set_attribute(:wzranked_uno, {:arg, :wzranked_uno})
    end

    update :reset_password do
      accept []
      change reset_password()
    end

    destroy :destroy
  end
end
