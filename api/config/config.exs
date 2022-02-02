# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :pl_connect, Oban,
  engine: Oban.Pro.Queue.SmartEngine,
  repo: PlConnect.Repo,
  plugins: [
    Oban.Plugins.Pruner,
    {Oban.Plugins.Cron,
     crontab: [
       {"@reboot", PlConnect.Workers.UserUpdater, args: %{page: 1}},
       # Run a summary once a day
       {"0 0 * * *", PlConnect.Workers.Summary, max_attempts: 1},
       {"0 * * * *", PlConnect.Workers.DisbandOldTeams} # DisbandTeams every hour
     ]},
    Oban.Plugins.Gossip,
    Oban.Web.Plugins.Stats,
    Oban.Pro.Plugins.Lifeline
  ],
  queues: [
    default: 5,
    updater: 5,
    inserter: 5,
    bet_processor: 10,
    processor_intercom_msgs: 10,
    processor_intercom_msg_bet: 10,
    intercom_notifiers: 10,
    analytics: 10,
    summary: 1,
    wzranked: [rate_limit: [allowed: 25, period: {1, :minute}]],
    external: 5
  ]

config :pl_connect,
  ecto_repos: [PlConnect.Repo],
  ash_apis: [PlConnect.Api],
  admins: [
    "austin@playerslounge.co",
    "zach@playerslounge.co",
    "marcus@playerslounge.co",
    "albert@playerslounge.co",
    "tucker@playerslounge.co",
    "mick@playerslounge.co",
    "luka@playerslounge.co",
    "john@playerslounge.co",
    "duncan@playerslounge.co",
    "marcus@playerslounge.co",
    "jordan@playerslounge.co",
    # test users
    "matt@opticpower.com",
    "jesse.hughes.it@gmail.com",
    "liz@opticpower.com",
    "s.bates+1@opticpower.com",
    "s.bates+2@opticpower.com",
    "s.bates+3@opticpower.com",
    "n.acosta@opticpower.com"
  ],
  intercom_token: System.get_env("INTERCOM_TOKEN"),
  intercom_user_id: System.get_env("INTERCOM_USER_ID"),
  retool_token: System.get_env("RETOOL_TOKEN"),
  tournaments_token: System.get_env("TOURNAMENTS_TOKEN"),
  tournaments_url: System.get_env("TOURNAMENTS_URL", "http://pl-dev-be-pl-tournaments-1366517835.us-east-1.elb.amazonaws.com"),
  admin_url: System.get_env("ADMIN_URL"),
  environment: System.get_env("ENVIRONMENT"),
  retool_url: System.get_env("RETOOL_URL"),
  verdansk_min_members: System.get_env("VERDANSK_MIN_MEMBERS", "1") |> Integer.parse() |> elem(0),
  rebirth_min_members: System.get_env("REBIRTH_MIN_MEMBERS", "2") |> Integer.parse() |> elem(0),
  caldera_min_members: System.get_env("CALDERA_MIN_MEMBERS", "1") |> Integer.parse() |> elem(0),
  berbix_config: [
    berbix_username: System.get_env("BERBIX_USERNAME"),
    berbix_template: System.get_env("BERBIX_TEMPLATE"),
    berbix_org_id: System.get_env("BERBIX_ORG_ID")
  ],
  paypal_config: [
    client: System.get_env("PAYPAL_CLIENT", "client"),
    secret: System.get_env("PAYPAL_SECRET", "secret"),
    url: System.get_env("PAYPAL_URL", "https://api-m.sandbox.paypal.com")
  ],
  max_kda_rebirth: System.get_env("MAX_KDA_REBIRTH", "1.5"),
  max_kda_verdansk:  System.get_env("MAX_KDA_VERDANSK", "5.0"),
  max_kda_caldera:  System.get_env("MAX_KDA_CALDERA", "5.0"),
  segment_apikey:  System.get_env("SEGMENT_APIKEY", "QTNCQjhMems1ejFXeFYybENEQ24zdWNXVzB3RDM1cDc6")

# Configures the endpoint
config :pl_connect, PlConnectWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base:
    System.get_env(
      "SECRET_KEY_BASE",
      "r46dwc7L/KswDKMO0vNxu+trCME9ovwonvE7ww+Fs0CtW0GAVWc/19KiSSLs1zb4"
    ),
  render_errors: [view: PlConnectWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: PlConnect.PubSub,
  live_view: [signing_salt: "z5sdK6ZE"]

config :pl_connect, time_zone: "America/Chicago"

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :tesla, :adapter, {Tesla.Adapter.Finch, name: CodApi}

config :ex_aws,
  access_key_id: ["AKIA554XLT4AZQTBFUOT", :instance_role],
  secret_access_key: ["AKIA554XLT4AZQTBFUOT", :instance_role]


config :pl_connect, PlConnect.Mailer,
  adapter: Bamboo.SesAdapter

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
