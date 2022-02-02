defmodule PlConnect.Cod.Resource.Team.Changes.SendInvitations do
  @moduledoc """
  Ash change, password hashing
  """
  use Ash.Resource.Change

  alias PlConnect.Api
  alias PlConnect.Cod.User

  require Ash.Query

  def send_invitations do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.before_action(changeset, fn changeset ->
      {:ok, user_ids} = Ash.Changeset.fetch_argument(changeset, :user_ids)

      users =
        User
        |> Ash.Query.filter(id in ^user_ids)
        |> Api.read!()

      if length(users) == length(user_ids) do
        add_users_to_record(changeset, users)
      end
    end)
  end

  defp add_users_to_record(changeset, users) do
    Enum.reduce(users, changeset, fn user, changeset ->
      Ash.Changeset.manage_relationship(
        changeset,
        :invitations,
        %{
          user: user,
          status: :pending
        },
        type: :create
      )
    end)
  end
end
