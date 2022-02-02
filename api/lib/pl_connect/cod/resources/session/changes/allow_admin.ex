defmodule PlConnect.Cod.Resource.Session.Changes.AllowAdmin do
  @moduledoc """
  Ash change, generates the session based on the given user
  """
  use Ash.Resource.Change

  @admins Application.compile_env!(:pl_connect, :admins)

  def allow_admin do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(%Ash.Changeset{errors: []} = changeset, _, _) do
    user = Ash.Changeset.get_attribute(changeset, :user)
    Ash.Changeset.force_change_attribute(changeset, :is_admin, user.email in @admins)
  end

  def change(changeset, _, _), do: changeset
end
