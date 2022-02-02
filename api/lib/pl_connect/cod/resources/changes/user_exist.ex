defmodule PlConnect.Cod.Resource.Changes.UserExist do
  @moduledoc """
  Ash change, checks user exist
  """
  use Ash.Resource.Change

  alias PlConnect.Cod.UserSearch

  def user_platform_exist do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    responses = [:xbl_platform_username, :psn_platform_username, :battlenet_platform_username]
      |> Enum.reduce([], fn key, acc ->
        profile = Ash.Changeset.get_attribute(changeset, key)
        if is_nil(profile) do
          acc ++ [{false, key, nil}]
        else
          [platform | _] = to_string(key) |> String.split("_")
          exist? = UserSearch.do_user_exist(profile, platform)
          {exist?, key, platform}
        end
      end)

    if responses |> Enum.map(&elem(&1, 0)) |> Enum.any?() do
      changeset
    else
      Enum.reduce(responses, changeset, fn {_, key, platform}, changeset ->
        Ash.Changeset.add_error(changeset,
          field: key,
          message:
            "Your #{platform} username was not found. Please ensure that it matches your COD username exactly, including case sensitivity"
        )
      end)
    end
  end
end
