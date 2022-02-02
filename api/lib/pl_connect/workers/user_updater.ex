defmodule PlConnect.Workers.UserUpdater do
  @moduledoc """
  Ran at start up, makes sure all user have their cache jobs running

  jobs are unique so even if the job is added it won't run twice
  """
  use Oban.Worker,
    queue: :default,
    priority: 0

  alias PlConnect.Workers

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"page" => page}}) do

    IO.inspect("###################################################################")
    IO.inspect(page, label: "users_page_#{page}")

    # list all users with their respective matches_count
    case get_users_matches_count(page) do
      %{results: []} -> :pass
      %{results: users} ->
        Enum.each(users, fn user ->
          if user.matches_count == 0 do
#          if no matches we send an insert message
            queue_insert_user(user)
          else
#          if has matches then send and update message
            queue_update_user(user)
          end

          queue_upsert_cod_user(user)
        end)

        __MODULE__.new(%{args: page + 1}, schedule_in: 5)
        |> Oban.insert!()
    end

    :ok
  end

  defp queue_insert_user(user) do
    [:xbl_platform_username, :psn_platform_username, :battlenet_platform_username]
    |> Enum.each(fn key ->
      profile = Map.get(user, key)
      if is_nil(profile) do
        :ok
      else
        [platform | _] = to_string(key) |> String.split("_")
        Workers.queue_insert_matches(user.id, profile, platform, user.wzranked_uno)
      end
    end)
  end

  defp queue_update_user(user) do
    [:xbl_platform_username, :psn_platform_username, :battlenet_platform_username]
    |> Enum.each(fn key ->
      profile = Map.get(user, key)
      if is_nil(profile) do
        :ok
      else
        [platform | _] = to_string(key) |> String.split("_")
        Workers.queue_update_matches(user.id, platform)
      end
    end)
  end

  defp queue_upsert_cod_user(user) do
    [:xbl_platform_username, :psn_platform_username, :battlenet_platform_username]
    |> Enum.each(fn key ->
      profile = Map.get(user, key)
      if is_nil(profile) do
        :ok
      else
        [platform | _] = to_string(key) |> String.split("_")
        Workers.queue_upsert_profile(user.id, profile, platform, user.wzranked_uno)
      end
    end)
  end

  @limit 500

  defp get_users_matches_count(page) do
    PlConnect.Cod.User
    |> Ash.Query.load([:matches_count])
    |> Ash.Query.select([:matches_count, :id, :xbl_platform_username, :psn_platform_username, :battlenet_platform_username, :wzranked_uno])
    |> PlConnect.Api.read!(page: [offset: @limit * page, limit: @limit])
  end
end
