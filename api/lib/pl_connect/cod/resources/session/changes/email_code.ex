defmodule PlConnect.Cod.Resource.Session.Changes.EmailCode do
  @moduledoc """
  Ash change, set's the given user to the resource
  """
  use Ash.Resource.Change
  require Ash.Query

  alias PlConnect.MailClient

  def email_code() do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    code = get_argument(changeset, :code)
    email = get_argument(changeset, :email)

    MailClient.send_verification_code(email, code)

    Ash.Changeset.force_change_attribute(changeset, :is_admin, true)
  end

  defp get_argument(changeset, key) do
    case Ash.Changeset.fetch_argument(changeset, key) do
      {:ok, value} -> value
      _ -> nil
    end
  end

end
