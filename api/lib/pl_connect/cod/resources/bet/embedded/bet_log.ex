defmodule PlConnect.Cod.Bet.BetLog do
  @moduledoc """
  Representing the value of a bet and the bet amount of the given level
  """

  use Ash.Resource,
    data_layer: :embedded,
    extensions: [AshGraphql.Resource]

  graphql do
    type :bet_log
  end

  attributes do
    attribute :event, :atom do
      constraints one_of: [
                    :automatic_resolved,
                    :manual_resolved,
                    :search_started,
                    :search_ended,
                    :created,
                    :refunded,
                    :cancelled
                  ]

      allow_nil? false
    end

    create_timestamp :inserted_at
  end
end
