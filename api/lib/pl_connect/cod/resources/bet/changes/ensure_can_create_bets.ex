defmodule PlConnect.Cod.Resource.Bet.Changes.EnsureCanCreateBets do
  @moduledoc """
  Check if the users has enough money inside their wallet
  """
  use Ash.Resource.Change

  require Ash.Query

  def ensure_can_create_bets do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      flag = PlConnect.Cod.Feature.get_feature_flag(:stop_bets)
      if flag.value do
        changeset
      else
        Ash.Changeset.add_error(changeset,
          field: :teammates,
          message: "Closed bets, try again later. Contact support for help"
        )
      end
    end)
    |> Ash.Changeset.before_action(fn changeset ->
      team_id = Ash.Changeset.get_argument(changeset, :team_id)

      team =
        PlConnect.Cod.Team
        |> Ash.Query.filter(id == ^team_id)
        |> Ash.Query.load([teammates: [:user]])
        |> PlConnect.Api.read_one!()

      Enum.reduce(team.teammates, true, &(&2 and !&1.user.flags.disallow_bets))
      |> if do
        changeset
      else
        Ash.Changeset.add_error(changeset,
          field: :teammates,
          message: "User unable to place bets at this time. Contact support for help"
        )
      end
    end)
  end

end
