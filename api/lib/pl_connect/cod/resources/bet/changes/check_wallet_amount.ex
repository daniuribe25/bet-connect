defmodule PlConnect.Cod.Resource.Bet.Changes.CheckWalletAmount do
  @moduledoc """
  Check if the users has enough money inside their wallet
  """
  use Ash.Resource.Change

  alias Ash.Changeset
  alias PlConnect.Helpers

  require Ash.Query

  def check_wallet_amount do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn changeset, record ->
      users = evaluate_wallet_of_users(changeset)

      if Enum.empty?(users) do
        {:ok, record}
      else
        {:error, incorrect_error(changeset, users).errors}
      end
    end)
  end

  defp evaluate_wallet_of_users(changeset) do
    bet_total_amount = Changeset.get_attribute(changeset, :bet_total_amount)
    team_id = Changeset.get_argument(changeset, :team_id)

    team =
      PlConnect.Cod.Team
      |> Ash.Query.filter(id == ^team_id)
      |> Ash.Query.load([:owner, teammates: [:user]])
      |> PlConnect.Api.read_one!()

    Enum.filter(team.teammates, fn teammate ->
      teammate.user.wallet.funds < bet_total_amount
    end)
    |> Enum.map(fn teammate ->
      Helpers.get_username_platform(teammate.user)
    end)
  end

  defp incorrect_error(changeset, usernames) do
    Ash.Changeset.add_error(changeset,
      field: :users,
      message:
        "The #{Helpers.text_plural_singular(usernames, "players", "player")} #{
          Helpers.arr_to_string(usernames)
        } doesn´t have enough money for the bet"
    )
  end
end
