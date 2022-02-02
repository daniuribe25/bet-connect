defmodule PlConnect.Cod.Resource.Changes.HashPassword do
  @moduledoc """
  Ash change, password hashing
  """
  use Ash.Resource.Change

  def hash_password do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    case Ash.Changeset.fetch_argument(changeset, :password) do
      {:ok, password} ->
        %{password_hash: password_hash} = Argon2.add_hash(password)

        Ash.Changeset.force_change_attribute(changeset, :password_hash, password_hash)

      _ ->
        changeset
    end
  end
end
