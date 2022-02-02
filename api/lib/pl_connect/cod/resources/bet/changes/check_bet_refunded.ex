defmodule PlConnect.Cod.Resource.Bet.Changes.CheckBetRefunded do
  @moduledoc """
  Check if possible to refund the bet
  """
  use Ash.Resource.Change
  require Ash.Query

  def check_bet_refunded do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      if changeset.data.status == :waiting or changeset.data.status == :complete do
        changeset
      else
        Ash.Changeset.add_error(changeset,
          field: :bets,
          message: "Impossible to refund. The Bet needs to be in wait or completed"
        )
      end
    end)
  end

end
