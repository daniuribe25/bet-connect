defmodule PlConnect.Cod.User.Validations.ValidateCurrentPassword do
  use Ash.Resource.Validation

  @impl true
  def validate(changeset, _) do
    password = Ash.Changeset.get_argument(changeset, :current_password)

    if PlConnect.Cod.User.Helpers.valid_password?(changeset.data, password) do
      :ok
    else
      {:error,
       Ash.Error.Changes.InvalidArgument.exception(
         field: :current_password,
         message: "Invalid data"
       )}
    end
  end
end
