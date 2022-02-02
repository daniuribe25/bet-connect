use Mix.Config

config :pl_connect,
  tournaments_token: "test_token"

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :pl_connect, PlConnect.Repo,
  username: System.get_env("POSTGRES_USERNAME", "postgres"),
  password: System.get_env("POSTGRES_PASSWORD", "postgres"),
  database: "pl_connect_test",
  hostname: System.get_env("POSTGRES_HOSTNAME", "localhost"),
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :pl_connect, PlConnectWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Disable oban during test
config :pl_connect, Oban, queues: false, plugins: false
config :tesla, PlConnect.Segment, adapter: Tesla.Mock
config :tesla, PlConnect.Intercom.ApiClient, adapter: Tesla.Mock
config :tesla, PlConnect.ApiClient.PaypalClient, adapter: Tesla.Mock
config :tesla, PlConnect.ApiClient.CodTrackerGG, adapter: Tesla.Mock
config :tesla, PlConnect.ApiClient.TourneysClient, adapter: Tesla.Mock
