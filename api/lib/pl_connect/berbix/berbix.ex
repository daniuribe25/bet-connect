defmodule PlConnect.Berbix do
  @moduledoc """
  Berbix resource
  """
  use Ash.Resource,
    extensions: [AshGraphql.Resource]

  import PlConnect.Berbix.Change, only: [berbix_change: 0]

  graphql do
    type :berbix

    mutations do
      create :create_berbix_token, :create_token
    end
  end

  attributes do
    attribute :token, :string, allow_nil?: false, primary_key?: true
  end

  actions do
    create :create_token do
      argument :user_id, :uuid, allow_nil?: false
      change berbix_change()
    end
  end
end
