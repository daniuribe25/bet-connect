defmodule PlConnect.Cod.Resource.Session.Changes.GenerateSession do
  @moduledoc """
  Ash change, generates the session based on the given user
  """
  use Ash.Resource.Change

  alias PlConnect.Cod.Sessions

  def generate_session do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(%Ash.Changeset{errors: []} = changeset, _, _) do
    user = Ash.Changeset.get_attribute(changeset, :user)

    Ash.Changeset.force_change_attribute(changeset, :token, Sessions.generate_token(user.id))
  end

  def change(changeset, _, _), do: changeset
end
