defmodule PlConnect.Cod.Resource.Changes.User.PaypalTransactionProcess do
  @moduledoc """
  Ash change
  """
  use Ash.Resource.Change

  alias PlConnect.Api
  alias PlConnect.Segment
  alias PlConnect.ApiClient.PaypalClient

  def paypal_transaction_process do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      {:ok, order_id} = Ash.Changeset.fetch_argument(changeset, :order_id)
      {:ok, authorization_id} = Ash.Changeset.fetch_argument(changeset, :authorization_id)

      {:ok, capture_id, amount} = PaypalClient.complete_transaction!(order_id, authorization_id)

      id = Ash.Changeset.get_attribute(changeset, :id)
      %{funds: funds} = Ash.Changeset.get_attribute(changeset, :wallet)

      # first deposit event
      case Api.get_last_deposit(id) do
        {:ok, _} -> :ok
        _ ->
          %{
            user_id: id,
            event_name: "user_first_deposit",
            value: "#{amount}"
          }
          |> Api.save_report_event!()
      end

      # new deposit
      extra_info = case Api.get_report_event(id, "deposited") do
        {:ok, %{additional_info: additional_info}} ->
          %{
            user_id: id,
            event_name: "deposited",
            value: "#{amount}",
            additional_info: %{
              deposits_count: additional_info["deposits_count"] + 1,
              deposits_total: additional_info["deposits_total"] + amount,
              deposits_average: additional_info["deposits_total"] / (additional_info["deposits_count"] + 1),
              withdrawals_count: additional_info["withdrawals_count"],
              withdrawals_total: additional_info["withdrawals_total"],
              withdrawals_average: additional_info["withdrawals_average"],
            }
          }
          |> Api.save_report_event!()
          |> Map.get(:additional_info)
        _ ->
          %{
            user_id: id,
            event_name: "deposited",
            value: "#{amount}",
            additional_info: %{
              deposits_count: 1,
              deposits_total: amount,
              deposits_average: amount,
              withdrawals_count: 0,
              withdrawals_total: 0,
              withdrawals_average: 0,
            }
          }
          |> Api.save_report_event!()
          |> Map.get(:additional_info)
      end
      |> Map.delete(:withdrawals_count)
      |> Map.delete(:withdrawals_total)
      |> Map.delete(:withdrawals_average)
      Segment.identify(changeset.data, extra_info)

      {:ok, _} = Api.create_wallet_transaction(
        nil,
        nil,
        id,
        %{
          bet_total_amount: 0,
          prev_wallet_balance: funds,
          post_wallet_balance: funds + amount,
          type: :deposit,
          won: false,
          status: :deposit,
          metadata: %{
            amount: amount,
            paypal_order_id: order_id,
            paypal_capture_id: capture_id,
            paypal_authorization_id: authorization_id
          }
        }
      )

      Ash.Changeset.force_change_attribute(changeset, :wallet, %{funds: funds + amount})
    end)
  end

end
