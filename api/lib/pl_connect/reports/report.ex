defmodule PlConnect.Report do
  use Ash.Resource, data_layer: AshPostgres.DataLayer

  postgres do
    table "user_events_info"
    repo PlConnect.Repo
  end

  attributes do
    uuid_primary_key :id
    attribute :user_id, :uuid
    attribute :event_name, :string
    attribute :value, :string
    attribute :additional_info, :map, default: %{}
    create_timestamp :inserted_at
  end

  code_interface do
    define :get_all_reports, action: :read
    define :get_report_event, action: :read_last, args: [:user_id, :event_name], get?: true
    define :get_report_event_value, action: :read_last_value, args: [:user_id, :value, :event_name], get?: true
    define :save_report_event, action: :create
    define :update_report_event, action: :update
  end

  actions do
    read :read, primary?: true
    read :read_last do
      argument :user_id, :uuid, allow_nil?: false
      argument :event_name, :string, allow_nil?: false
      filter expr(user_id == ^arg(:user_id) and event_name == ^arg(:event_name))
      prepare build(limit: 1, sort: [inserted_at: :desc])
    end
    read :read_last_value do
      argument :user_id, :uuid, allow_nil?: false
      argument :value, :string, allow_nil?: false
      argument :event_name, :string, allow_nil?: false
      filter expr(user_id == ^arg(:user_id) and value == ^arg(:value) and event_name == ^arg(:event_name))
      prepare build(limit: 1, sort: [inserted_at: :desc])
    end
    create :create
    update :update
  end

end
