defmodule PlConnectWeb.UserSocket do
  use Phoenix.Socket

  alias PlConnect.Cod.Sessions

  ## Channels
  # channel "room:*", PlConnectWeb.RoomChannel
  channel "user:*", PlConnectWeb.UserChannel
  channel "team:*", PlConnectWeb.TeamChannel
  channel "feature:*", PlConnectWeb.FeatureChannel

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    {:ok, user_id} = Sessions.retrive_token_data(token)
    {:ok, assign(socket, :user_id, user_id)}
  end

  def connect(_params, _socket, _connect_info), do: :error

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     PlConnectWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  @impl true
  def id(%{assigns: %{user_id: user_id}}), do: "user:#{user_id}"
end
