defmodule PlConnectWeb.Router do
  use PlConnectWeb, :router

  import AshAdmin.Router
  import Oban.Web.Router

  # AshAdmin requires a Phoenix LiveView `:browser` pipeline
  # If you DO NOT have a `:browser` pipeline already, then AshAdmin has a `:browser` pipeline
  # Most applications will not need this:
  admin_browser_pipeline(:browser)

  pipeline :auth_admin do
    plug PlConnect.Plugs.UserRequiredPlug
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :absinthe do
    plug PlConnect.Plugs.UserPlug
  end

  pipeline :api_external do
    plug PlConnect.Plugs.HeaderReq, header: "authorization", value: Application.get_env(:pl_connect, :tournaments_token)
  end

  pipeline :rest_auth do
    plug PlConnect.Plugs.RestAuth
  end

  scope "/", PlConnectWeb do
    pipe_through :api
    get "/alive", ServerController, :index
    post "/berbix", BerbixWebohookController, :index
  end

  scope "/" do
    pipe_through :absinthe

    forward "/gql", Absinthe.Plug,
      schema: PlConnect.Schema,
      before_send: {__MODULE__, :absinthe_before_send}

    forward "/playground",
            Absinthe.Plug.GraphiQL,
            schema: PlConnect.Schema,
            interface: :playground,
            before_send: {__MODULE__, :absinthe_before_send}
  end

  scope "/" do
    pipe_through [:browser]
    get "/sync", PlConnectWeb.SessionSyncController, :index
  end

  scope "/" do
    # Pipe it through your browser pipeline
    pipe_through [:auth_admin, :browser]

    ash_admin("/admin",
      apis: [PlConnect.Api]
    )

    oban_dashboard("/oban")
  end

  scope "/external" do
    pipe_through [:api]

    get "/matches", PlConnectWeb.ExternalController, :matches
    post "/schedule", PlConnectWeb.ExternalController, :schedule
    post "/refund", PlConnectWeb.ExternalController, :refund_users
  end

  scope "/api" do
    pipe_through [:api, :rest_auth]
    get "/tournaments", PlConnectWeb.ExternalController, :all
    get "/tournaments/history", PlConnectWeb.ExternalController, :get_tournaments_by_user
    get "/tournaments/:tourney_id", PlConnectWeb.ExternalController, :get
    post "/tournaments/:tourney_id/join", PlConnectWeb.ExternalController, :join
    post "/tournaments/:tourney_id/leave", PlConnectWeb.ExternalController, :leave
  end

  def absinthe_before_send(conn, %Absinthe.Blueprint{} = blueprint) do
    if auth_token = blueprint.execution.context[:auth_token] do
      put_resp_cookie(conn, "auth_token", auth_token)
    else
      conn
    end
  end

  def absinthe_before_send(conn, _) do
    conn
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  # if Mix.env() in [:dev, :test] do
  import Phoenix.LiveDashboard.Router

  scope "/" do
    pipe_through [:fetch_session, :protect_from_forgery]
    live_dashboard "/dashboard", metrics: PlConnectWeb.Telemetry, ecto_repos: [PlConnect.Repo]
  end

  # end
end
