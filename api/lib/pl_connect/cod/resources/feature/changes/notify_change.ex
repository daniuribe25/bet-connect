defmodule PlConnect.Cod.Resource.Feature.Changes.NotifyChange do
  @moduledoc """
  Notify when some changes have been
  """
  use Ash.Resource.Change
  require Ash.Query

  def notify_change do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn _changeset, record ->
      PlConnectWeb.Endpoint.broadcast("feature:lobby", "event", %{
        domain: record.domain,
        value: record.value,
        type: record.type,
        description: record.description
      })
      {:ok, record}
    end)
  end
end
