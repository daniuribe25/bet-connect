defmodule PlConnect.Cod.UserSearch do
  @moduledoc """
  Module for user search related functions
  """
  alias PlConnect.ApiClient.CodTrackerGG

  def do_user_exist(username, platform) do
    data = CodTrackerGG.search_user(username, platform)

    case data do
      [%{"platformSlug" => ^platform, "platformUserIdentifier" => ^username}] ->
        true

      _ ->
        false
    end
  end
end
