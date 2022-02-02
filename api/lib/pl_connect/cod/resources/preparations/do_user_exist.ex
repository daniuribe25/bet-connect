defmodule PlConnect.Cod.Resource.Preparations.DoUserExists do
  @moduledoc """
  Prepare the data querying the api and bringing the desired result
  """
  use Ash.Resource.Preparation

  alias PlConnect.Cod.UserSearch
  alias Ash.Query

  def prepare(query, _, _) do
    username = Query.get_argument(query, :username)
    platform = Query.get_argument(query, :platform)
    Ash.Query.put_context(query, :data, get_data(username, platform))
  end

  defp get_data(username, platform) do
    # *must* return a list of instances of the resource
    [
      # required workaround due to compilation deathlock
      struct!(PlConnect.Cod.UserExist, %{
        user_exists: UserSearch.do_user_exist(username, platform)
      })
    ]
  end
end
