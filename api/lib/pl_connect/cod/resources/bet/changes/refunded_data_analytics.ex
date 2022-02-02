defmodule PlConnect.Cod.Resource.Bet.Changes.RefundedDataAnalytics do
  @moduledoc false
  PlConnect.Workers.Analytics.TrackRefund

  use Ash.Resource.Change
  require Ash.Query

  def refunded_data_analytics do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      PlConnect.Workers.Analytics.TrackRefund.new(%{bet_id: changeset.data.id})
      |> Oban.insert()
      changeset
    end)
  end
end
