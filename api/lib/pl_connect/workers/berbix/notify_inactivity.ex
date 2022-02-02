defmodule PlConnect.Workers.Berbix.NotifyInactivity do
  @moduledoc """
  Ran ONLY when an user isnt verified by berbix
  """
  use Oban.Worker,
      queue: :intercom_notifiers,
      priority: 0

  alias PlConnect.Api
  alias PlConnect.Intercom.ApiClient

  @impl Oban.Worker
  def perform(%Oban.Job{
    args: %{"user_id" => user_id}
  }) do
    user = Api.get_user!(user_id)
    resp = if !user.age_verified, do: ApiClient.user_need_manual_age_validation(user), else: nil

    {:ok, resp}
  end

  @impl Oban.Worker
  def timeout(_job), do: :timer.seconds(20)

end