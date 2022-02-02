defmodule PlConnect.Cod.Resource.Changes.User.SetTempFields do
  @moduledoc """
  Ash change to save the phone and temporal fields
  """
  use Ash.Resource.Change
  use Ecto.Schema
  alias PlConnect.Helpers

  def set_temp_fields do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    phone = Ash.Changeset.get_argument(changeset, :phone)
    email = Ash.Changeset.get_argument(changeset, :email)
    if is_nil(phone) && is_nil(email) do
      Ash.Changeset.add_error(changeset,
        field: :phone,
        message: "Phone or email required"
      )
    else
      nickname = Helpers.generate_rand(8)
      %{password_hash: password_hash} = Argon2.add_hash(nickname)

      changeset = changeset
        |> Ash.Changeset.change_attribute(:email, (email || "#{nickname}@email.com"))
        |> Ash.Changeset.change_attribute(:password_hash, password_hash)

      unless is_nil(phone),
        do: Ash.Changeset.change_attribute(changeset, :phone, phone),
        else: changeset
    end
  end

end
