defmodule PlConnect.Cod.Resource.Prepares.SearchByGamerTag do
  @moduledoc """
  Ash prepare, find the user by gamertag
  """
  use Ash.Resource.Preparation

  require Ash.Query

  def prepare(query, _, _) do
    username = Ash.Query.get_argument(query, :username)
    search = "%#{username}%"

    Ash.Query.filter(
      query,
      fragment("? ILIKE ?", xbl_platform_username, ^search) or
        fragment("? ILIKE ?", psn_platform_username, ^search) or
        fragment("? ILIKE ?", battlenet_platform_username, ^search)
    )
    |> Ash.Query.sort(inserted_at: :desc)
  end
end
