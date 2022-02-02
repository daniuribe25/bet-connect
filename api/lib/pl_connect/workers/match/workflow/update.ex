defmodule PlConnect.Workers.Match.Workflow.Update do
  @moduledoc """
  Updates matches for a given user, it takes into account the last record in database
  """
  use Oban.Pro.Workers.Workflow, queue: :external

  alias PlConnect.Api
  alias PlConnect.ApiClient.Utils
  alias PlConnect.ApiClient.CodTrackerGG
  alias PlConnect.Workers.Match.Update.Common
  alias PlConnect.Cod.User

  require Ash.Query

  def process(%Oban.Job{args: %{"user_id" => user_id, "platform" => platform}}) do
    case Api.get_user_latest_match(user_id) do
      {:ok, player_match} ->
        username = Utils.get_user_platform_username(player_match.user, platform)

        matches_response = CodTrackerGG.get_user_last_matches!(username, platform)

        Common.process_to_update(
          player_match,
          matches_response,
          username,
          platform,
          user_id,
          player_match.id,
          nil
        )
      {:error, %Ash.Error.Query.NotFound{}} ->
        # If user has no games, queue up schedule
        {:ok, user} =
          User
          |> Ash.Query.filter(id == ^user_id)
          |> Api.read_one()

        username = Utils.get_user_platform_username(user, platform)

        %{user_id: user_id, username: username, platform: platform}
        |> PlConnect.Workers.Match.Insert.new()
        |> Oban.insert!()

        :ok
      _ -> :ok
    end

    :ok
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(20)
end
