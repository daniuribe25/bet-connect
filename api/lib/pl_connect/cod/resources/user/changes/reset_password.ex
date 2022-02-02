defmodule PlConnect.Cod.Resource.Changes.User.ResetPassword do
  @moduledoc """
  Ash change, checks user exist
  """
  use Ash.Resource.Change

  require Ash.Query

  alias PlConnect.Helpers
  alias PlConnect.MailClient

  def reset_password do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    password = Helpers.generate_rand(4)
      |> (&("plc_#{&1}")).()

    Ash.Changeset.get_attribute(changeset, :email)
    |> MailClient.send_password_reset(password)

    %{password_hash: password_hash} = Argon2.add_hash(password)

    Ash.Changeset.force_change_attribute(changeset, :password_hash, password_hash)
  end

end
