defmodule PlConnect.Cod.Session do
  @moduledoc """
  User resource
  """
  use Ash.Resource,
    extensions: [
      AshGraphql.Resource
    ]

  import PlConnect.Cod.Resource.Session.Changes.CreateUser, only: [create_user: 0]
  import PlConnect.Cod.Resource.Session.Changes.GenerateSession, only: [generate_session: 0]
  import PlConnect.Cod.Resource.Session.Changes.LoginUser, only: [login_user: 0]
  import PlConnect.Cod.Resource.Changes.Lowercase, only: [lowercase: 1]
  import PlConnect.Cod.Resource.Session.Changes.AllowAdmin, only: [allow_admin: 0]
  import PlConnect.Cod.Resource.Session.Changes.EmailCode, only: [email_code: 0]

  alias PlConnect.Cod.Session.TokenMiddleware

  graphql do
    type :session

    mutations do
      create :register_user, :create_user

      create :authenticate_user, :authenticate_user,
        modify_resolution: {TokenMiddleware, :token_to_ctx, []}

      create :send_email_verification_code, :send_email_verification_code
    end
  end

  attributes do
    # required by ash, not needed
    attribute :token, :string, allow_nil?: false, primary_key?: true
    attribute :is_admin, :boolean, allow_nil?: false, default: false
    attribute :user, :map, private?: true
  end

  code_interface do
    define :authenticate_user, action: :authenticate_user, args: [:email, :phone, :password]
  end

  actions do
    create :default, primary?: true

    create :create_user do
      accept []

      argument :password, :string,
        allow_nil?: false,
        constraints: [
          max_length: 80,
          min_length: 8
        ]

      argument :password_confirmation, :string, allow_nil?: false

      argument :xbl_platform_username, :string
      argument :psn_platform_username, :string
      argument :battlenet_platform_username, :string

      argument :email, :string, allow_nil?: false

      validate confirm(:password, :password_confirmation)

      change lowercase(:email)

      change create_user()
      change generate_session()
    end

    create :authenticate_user do
      accept []

      argument :email, :string, sensitive?: true
      argument :phone, :string, sensitive?: true
      argument :password, :string, allow_nil?: false, sensitive?: true

      change login_user()
      change generate_session()
      change allow_admin()
    end

    create :send_email_verification_code do
      accept []
      argument :email, :string, sensitive?: true
      argument :code, :string, sensitive?: true
      change email_code()
    end
  end
end
