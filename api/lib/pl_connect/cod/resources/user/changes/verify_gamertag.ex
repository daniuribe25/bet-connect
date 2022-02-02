defmodule PlConnect.Cod.Resource.Changes.User.VerifyGamertag do
  @moduledoc """
  Check if possible to refund the bet
  """
  use Ash.Resource.Change
  require Ash.Query

  alias PlConnect.Helpers
  alias PlConnect.Cod.Resource.Team.Changes.SavePrivateUsers

  def verify_gamertag do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    platform = Helpers.get_platform(changeset)
    gamertag = Helpers.get_username_platform(changeset)

    case SavePrivateUsers.account_visible(gamertag, platform) do
      {_, true} -> changeset
      _ ->
        Ash.Changeset.add_error(changeset,
          field: Helpers.get_platform_field(changeset),
          message: "Gamertag not found"
        )
    end
  end

end
