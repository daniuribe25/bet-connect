defmodule PlConnectWeb.FeatureChannel do
  use Phoenix.Channel

  @impl true
  def join("feature:lobby", _params, socket), do: {:ok, socket}
  def join(_, _, _), do: {:error, %{reason: "unauthorized"}}
end
