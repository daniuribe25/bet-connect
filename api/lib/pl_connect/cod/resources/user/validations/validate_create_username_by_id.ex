defmodule PlConnect.Cod.User.Validations.ValidateCreateUsernameById do
  use Ash.Resource.Validation

  @impl true
  def validate(changeset, _) do
    if changeset.data.step_register == :step_1 do
      :ok
    else
      {:error,
       Ash.Error.Changes.InvalidArgument.exception(
         field: :user,
         message: "The account needs to pass the previous step"
       )}
    end
  end
end
