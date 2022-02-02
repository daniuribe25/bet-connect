defmodule PlConnect.Cod.Resource.Changes.User.ProfileVerification do
  @moduledoc """
  Ash change, checks user exist
  """
  use Ash.Resource.Change

  require Ash.Query

  alias PlConnect.Api
  alias PlConnect.Helpers
  alias PlConnect.Cod.Resource.Team.Changes.SavePrivateUsers

  def profile_verification(sign_up) do
    {__MODULE__, [sign_up: sign_up]}
  end

  def init(opts), do: {:ok, opts}

  def change(changeset, [sign_up: sign_up], _) do
    platform = Helpers.get_platform(changeset)
    gamertag = Helpers.get_username_platform(changeset)

    {_, is_visible?} = SavePrivateUsers.account_visible(gamertag, platform)
    IO.inspect(is_visible?, label: "#### THIS IS VISISBLEEEE ###")
    if sign_up do
      now = Timex.now()
      week_start = Timex.beginning_of_week(now)
      %{
        user_id: Ash.Changeset.get_attribute(changeset, :id),
        event_name: "user_created_account",
        value: Ash.Changeset.get_attribute(changeset, :id),
        additional_info: %{
          sign_up_timestamp: now,
          sign_up_week: week_start
        }
      }
      |> Api.save_report_event()
    end

    Ash.Changeset.force_change_attribute(changeset, :private_profile, !is_visible?)
  end
end
