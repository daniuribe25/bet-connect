defmodule PlConnect.MixProject do
  use Mix.Project

  def project do
    [
      app: :pl_connect,
      version: "0.1.0",
      elixir: "~> 1.7",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix, :gettext] ++ Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      test_coverage: [tool: ExCoveralls],
      preferred_cli_env: [
        coveralls: :test,
        "coveralls.json": :test
      ]
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {PlConnect.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support", "test/helpers"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.

  defp deps do
    [
      {:phoenix, "~> 1.5.8"},
      {:phoenix_ecto, "~> 4.1"},
      {:ecto_sql, "~> 3.4"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_live_dashboard, "~> 0.4"},
      {:telemetry_metrics, "~> 0.4"},
      {:telemetry_poller, "~> 0.4"},
      {:gettext, "~> 0.11"},
      {:jason, "~> 1.0"},
      {:plug_cowboy, "~> 2.0"},
      {:credo, "~> 1.5", only: [:dev, :test], runtime: false},
      {:finch, "~> 0.6"},
      {:tesla, "~> 1.4"},
      {:hackney, "~> 1.17"},
      {:puid, "~> 1.1"},
      {:ash, "~> 1.46"},
      {:ash_graphql, "~> 0.16.28"},
      {:ash_postgres, "~> 0.40.3"},
      {:absinthe_plug, "~> 1.5"},
      {:argon2_elixir, "~> 2.4"},
      {:cors_plug, "~> 2.0"},
      {:faker, "~> 0.16"},
      {:uuid, "~> 1.1"},
      {:ash_policy_authorizer, "~> 0.16.2"},
      {:ecto_psql_extras, "~> 0.6.5"},
      {:cachex, "~> 3.4"},
      {:ash_admin, "~> 0.2.22"},
      #      {:ash_admin, path: "../ash_admin"},
      {:timex, "~> 3.0"},
      {:oban, "~> 2.7"},
      {:libcluster, "~> 3.3"},
      {:oban_web, "~> 2.7", repo: "oban"},
      {:oban_pro, "~> 0.8", repo: "oban"},
      {:csv, "~> 2.4"},
      {:ex_machina, "~> 2.7.0", only: :test},
      {:excoveralls, "~> 0.14.2", only: :test},
      {:neuron, "~> 5.0.0"},
      {:mock, "~> 0.3.3", only: :test},
      {:ex_aws, "~> 2.1"},
      {:bamboo, "~> 2.2.0"},
      {:bamboo_ses, "~> 0.2.0"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test --color --cover"]
    ]
  end
end
