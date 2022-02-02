defmodule PlConnect.Cod.SummaryStats do
  @moduledoc """
  High Level Summary of how the app is operating.
  """
  use Ash.Resource, data_layer: AshPostgres.DataLayer

  postgres do
    repo PlConnect.Repo
    table "summary_stats"
  end

  attributes do
    uuid_primary_key :id
    # range
    attribute :start_range, :utc_datetime
    attribute :end_range, :utc_datetime

    # player_financials
    attribute :total_funds_in_player_accounts, :float
    attribute :total_registered_players, :integer
    attribute :average_player_balance, :float

    # summary stats
    attribute :total_new_players, :integer
    attribute :total_new_players_completed_a_game, :integer
    attribute :total_matches_played, :integer
    attribute :total_matches_per_player, :float
    attribute :total_bets_placed, :integer
    attribute :total_bets_placed_per_player, :float
    attribute :total_entry_fees, :float
    attribute :total_house_money_won_to_players, :float
    attribute :total_player_money_lost_to_house, :float
    attribute :total_net_performance, :float
    attribute :total_percent_house_handle, :float
    attribute :entry_fees_per_player, :float
    attribute :total_house_money_won_per_player, :float
    attribute :total_house_money_lost_per_player, :float
    attribute :total_net_performance_per_player, :float

    create_timestamp :inserted_at, private?: false, allow_nil?: true
  end

  code_interface do
    define :create_weekly_stat,
      action: :create,
      args: [:bet_history_id, :team_id, :user_id]
  end
end
