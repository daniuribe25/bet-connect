defmodule PlConnect.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    topologies = Application.get_env(:libcluster, :topologies) || []
    tournaments_url = Application.get_env(:pl_connect, :tournaments_url)

    authentication = Base.encode64("auto:WGcXjJBFskEJFhKNsYn5KuMda")

    children = [
      # libcluster supervisor
      {Cluster.Supervisor, [topologies, [name: PlConnect.ClusterSupervisor]]},
      # Start the Ecto repository
      PlConnect.Repo,
      # Start the Telemetry supervisor
      PlConnectWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: PlConnect.PubSub},
      # Start the Endpoint (http/https)
      PlConnectWeb.Endpoint,
      # Start a worker by calling: PlConnect.Worker.start_link(arg)
      # {PlConnect.Worker, arg}
      {Cachex, name: :tesla_cache_cachex},
      {Finch,
       name: CodApi,
       pools: %{
         :default => [
           size: 1,
           count: 10,
           conn_opts: [
             proxy: {:http, "proxy.apify.com", 8000, []},
             proxy_headers: [{"Proxy-Authorization", "Basic #{authentication}"}]
           ]
         ],
         "https://api.tracker.gg" => [
           count: 10,
           conn_opts: [
             proxy: {:http, "proxy.apify.com", 8000, []},
             proxy_headers: [{"Proxy-Authorization", "Basic #{authentication}"}]
           ]
         ],
         "https://codstats.hasura.app" => [
           count: 10,
           conn_opts: [
             proxy: {:http, "proxy.apify.com", 8000, []},
             proxy_headers: [{"Proxy-Authorization", "Basic #{authentication}"}]
           ]
         ],
         tournaments_url => [
          count: 10,
         ]
       }},
      {Oban, oban_config()}
    ]

    # install python dependencies
    # python_dependencies =
    #   Path.join(["#{:code.priv_dir(:pl_connect)}", "pl-codplay-master", "requirements.txt"])

    # _ = System.cmd("pip3", ["install", "-r", python_dependencies])

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: PlConnect.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    PlConnectWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  # Conditionally disable queues or plugins here.
  defp oban_config do
    Application.fetch_env!(:pl_connect, Oban)
  end
end
