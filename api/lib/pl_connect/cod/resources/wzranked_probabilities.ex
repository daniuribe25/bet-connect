defmodule PlConnect.Cod.WzrankedProbabilities do
  @moduledoc false
  use Ash.Resource,
      data_layer: AshPostgres.DataLayer,
      extensions: [AshGraphql.Resource]

  postgres do
    table "wzranked_probabilities"
    repo PlConnect.Repo
  end

  graphql do
    type :wzranked_probability
  end

  attributes do
    uuid_primary_key :id
    attribute :verdansk_solo_duos, :map
    attribute :verdansk_trios, :map
    attribute :verdansk_quads, :map
    attribute :rebirth_island_solo_duos, :map
    attribute :rebirth_island_trios, :map
    attribute :rebirth_island_quads, :map

    create_timestamp :inserted_at, private?: false, allow_nil?: true
  end

  relationships do
    belongs_to :user, PlConnect.Cod.User
  end

  code_interface do
    define :get_wzranked_probabilities, action: :by_id, args: [:user_id]
    define :get_wzranked_probabilities_by_id, action: :by_id, args: [:user_id], get?: true
    define :add_new_wzranked_probabilities, action: :create, args: [:user_id]
  end

  actions do
    read :by_id do
      argument :user_id, :uuid, allow_nil?: false
      prepare build(sort: [inserted_at: :desc])
      filter expr(user_id == ^arg(:user_id))
    end

    create :create do
      accept [
        :verdansk_solo_duos,
        :verdansk_trios,
        :verdansk_quads,
        :rebirth_island_solo_duos,
        :rebirth_island_trios,
        :rebirth_island_quads
      ]
      argument :user_id, :uuid, allow_nil?: false
      change set_attribute(:user_id, {:arg, :user_id})
    end
  end

end