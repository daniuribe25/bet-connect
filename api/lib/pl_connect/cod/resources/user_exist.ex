defmodule PlConnect.Cod.UserExist do
  @moduledoc """
  Resource user exist check
  """
  use Ash.Resource,
    extensions: [
      AshGraphql.Resource
    ]

  graphql do
    type :user_exist

    queries do
      read_one :do_user_exist, :read
    end

    # required by ash, TODO: wait for fix
    mutations do
      create :create_user_exist, :create
    end
  end

  attributes do
    attribute :id, :integer, primary_key?: true, allow_nil?: false
    attribute :user_exists, :boolean, allow_nil?: false
  end

  actions do
    read :read do
      argument :username, :string, allow_nil?: false

      argument :platform, :atom do
        constraints one_of: [:xbl, :psn, :battlenet]
        allow_nil? false
      end

      prepare PlConnect.Cod.Resource.Preparations.DoUserExists
    end

    create :create
  end
end
