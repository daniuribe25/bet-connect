defmodule PlConnect.Cod.Resource.Bet.Changes.NotifyBetCancelled do
  @moduledoc """
  Notify to the users when the bet is canceled
  """
  use Ash.Resource.Change
  require Ash.Query
  alias Ash.Changeset

  def notify_bet_cancelled do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn changeset, record ->
      team_id = Changeset.get_attribute(changeset, :team_id)

      team =
        PlConnect.Cod.Team
        |> Ash.Query.filter(id == ^team_id)
        |> Ash.Query.load(teammates: [:user])
        |> PlConnect.Api.read_one!()

      Enum.each(
        team.teammates,
        &PlConnectWeb.Endpoint.broadcast("user:#{&1.user_id}", "bet_cancelled", %{
          team_id: team_id
        })
      )

      {:ok, record}
    end)
  end
end
