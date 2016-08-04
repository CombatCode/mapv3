# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :gis,
  ecto_repos: [Gis.Repo]

# Configures the endpoint
config :gis, Gis.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "mkOsdm53UCOxXvDLSHEX//HZfSMuZpJ1HpzM9oEFFoSFyeILaXi/DZil1Kjg6TIx",
  render_errors: [view: Gis.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Gis.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
