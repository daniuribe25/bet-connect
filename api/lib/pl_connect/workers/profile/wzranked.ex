defmodule PlConnect.Workers.Profile.Wzranked do
  @moduledoc false
  use Oban.Worker,
      queue: :wzranked,
      priority: 0

  alias PlConnect.Api
  alias PlConnect.Cod.BetLines

  @update_after 60 * 60 * 24

  @impl Oban.Worker
  def perform(%Oban.Job{
    args: %{"user_id" => user_id, "wzranked_uno" => wzranked_uno, "platform" => platform}
  }) do
    data = BetLines.generate_lines(wzranked_uno, platform)
      |> BetLines.transform_data(:list)

    Api.add_new_wzranked_probabilities(user_id, data)

    %{user_id: user_id, wzranked_uno: wzranked_uno, platform: platform}
    |> __MODULE__.new(schedule_in: @update_after)
    |> Oban.insert!()

    :ok
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(30)

end