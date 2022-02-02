defmodule PlConnect.Cod.Resource.Changes.User.QueueInsertMatches do
  @moduledoc """
  Ash change, password hashing
  """
  use Ash.Resource.Change

  alias PlConnect.Workers

  def queue_insert_matches do
    {__MODULE__, []}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, _, _) do
    Ash.Changeset.after_action(changeset, fn changeset, record ->
      wzranked_uno = Ash.Changeset.get_attribute(changeset, :wzranked_uno)

      [:xbl_platform_username, :psn_platform_username, :battlenet_platform_username]
      |> Enum.each(fn key ->
        profile = Ash.Changeset.get_attribute(changeset, key)
        if is_nil(profile) do
          :ok
        else
          [platform | _] = to_string(key) |> String.split("_")
          Workers.queue_insert_matches(record.id, profile, platform, wzranked_uno)
          Workers.queue_upsert_profile(record.id, profile, platform, wzranked_uno)
        end
      end)

      {:ok, record}
    end)
  end
end
