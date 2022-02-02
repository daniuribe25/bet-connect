defmodule PlConnect.Segment do
  @moduledoc false
  use Tesla

  alias PlConnect.Cod.User

  plug Tesla.Middleware.BaseUrl, "https://api.segment.io/v1"
  plug Tesla.Middleware.Headers, [
    {"authorization", "Basic #{Application.get_env(:pl_connect, :segment_apikey)}"},
    {"content-type", "application/json"}
  ]
  plug Tesla.Middleware.JSON

  def identify(%User{} = user, extras \\ %{}) do
    traits = Map.merge(extras, %{
      "user_id" => user.id,
      "phone" => user.phone,
      "email" => user.email,
      "private_profile" => user.private_profile,
      "age_verified" => user.age_verified
    })
    data =
      Jason.encode!(%{
        "userId" => user.id,
        "traits" => traits
      })
    post!("/identify", data)
  end

  def track(event, user_id, properties) do
    data =
      Jason.encode!(%{
        "event" => event,
        "userId" => user_id,
        "properties" => properties
      })
    post!("/track", data)
  end

end
