defmodule PlConnect.Cod.Feature do
  @moduledoc """
  Resource for save the Features Flags of the application
  """
  use Ash.Resource,
    data_layer: AshPostgres.DataLayer,
    extensions: [
      AshGraphql.Resource,
      AshAdmin.Resource
    ]

  @allowed_flags [
    :stop_bets,
    :general_multiplier,
    :notify_balance,
    :reducer_1,
    :reducer_2,
    :reducer_3,
    :reducer_4,
    :refund_timeout,
    :wzranked_engine,
    :bet_system_percent,
    :squad_grow,
    :br_keys,
    :plunder_keys,
    :resurgence_keys,
    :rebirth_lines_version,
    :rebirth_lines_default_value
  ]
  @default_flags %{
    stop_bets: %{
      domain: :stop_bets,
      type: :boolean,
      value: "true"
    },
    general_multiplier: %{
      domain: :general_multiplier,
      type: :float,
      value: "0.15"
    },
    notify_balance: %{
      domain: :notify_balance,
      type: :integer,
      value: "100"
    },
    reducer_1: %{
      domain: :reducer_1,
      type: :float,
      value: "0.55"
    },
    reducer_2: %{
      domain: :reducer_2,
      type: :float,
      value: "0.7"
    },
    reducer_3: %{
      domain: :reducer_3,
      type: :float,
      value: "0.9"
    },
    reducer_4: %{
      domain: :reducer_4,
      type: :float,
      value: "1.0"
    },
    refund_timeout: %{
      domain: :refund_timeout,
      type: :integer,
      value: "30"
    },
    wzranked_engine: %{
      domain: :wzranked_engine,
      type: :boolean,
      value: "false"
    },
    bet_system_percent: %{
      domain: :bet_system_percent,
      type: :integer,
      value: "80"
    },
    squad_grow: %{
      domain: :squad_grow,
      type: :float,
      value: "0.15"
    },
    br_keys: %{
      domain: :br_keys,
      type: :string,
      value: "br,battle royale,royale,vanguard royale,vg royale"
    },
    plunder_keys: %{
      domain: :plunder_keys,
      type: :string,
      value: "plunder"
    },
    resurgence_keys: %{
      domain: :resurgence_keys,
      type: :string,
      value: "resurgence,rebirth mini royale,vanguard resurgence"
    },
    rebirth_lines_version: %{
      domain: :rebirth_lines_version,
      type: :string,
      value: "1.0"
    },
    rebirth_lines_default_value: %{
      domain: :rebirth_lines_default_value,
      type: :float,
      value: "3.0"
    }
  }

  import PlConnect.Cod.Resource.Feature.Changes.NotifyChange, only: [notify_change: 0]

  postgres do
    table "features"
    repo PlConnect.Repo
  end

  graphql do
    type :features

    queries do
      list :get_feature_by_domain, :read
    end

    mutations do
      create :create_feature, :create
      update :update_feature, :update
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :description, :string, allow_nil?: false

    attribute :domain, :atom do
      constraints one_of: @allowed_flags
      allow_nil? false
      default :stop_bets
    end

    attribute :type, :atom do
      constraints one_of: [:atom, :string, :float, :boolean, :integer, :list]
      allow_nil? false
      default :string
    end
    attribute :value, :string, allow_nil?: false, default: "true"

    create_timestamp :inserted_at, private?: false, allow_nil?: true
    update_timestamp :updated_at, private?: false, allow_nil?: true
  end

  identities do
    identity :unique_domain, [:domain]
  end

  code_interface do
    define :get_feature_flag, action: :read, args: [:domain], get?: true
    define :create_feature, action: :create
    define :update_feature, action: :update
  end

  actions do
    read :read do
      primary? true
      argument :domain, :atom, allow_nil?: false
      filter expr(domain == ^arg(:domain))
    end

    create :create

    update :update do
      change notify_change()
    end
  end

  def get_feature_flag(domain) when domain in @allowed_flags do
    flag = case PlConnect.Api.get_feature_flag(domain) do
      {:ok, flag} -> flag
      _ -> @default_flags |> Map.get(domain)
    end
    Map.put(flag, :value, transform_value(flag))
  end

  defp transform_value(%{value: value, type: :list}), do: String.split(value, ",")
  defp transform_value(%{value: value, type: :atom}), do: String.to_atom(value)
  defp transform_value(%{value: value, type: :float}), do: String.to_float(value)
  defp transform_value(%{value: value, type: :integer}), do: String.to_integer(value)
  defp transform_value(%{value: value, type: :boolean}), do: value == "true"
  defp transform_value(%{value: value, type: _}), do: value
end
