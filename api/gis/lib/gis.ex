defmodule Gis do
  use Application

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      # Start the Ecto repository
      supervisor(Gis.Repo, []),
      # Start the endpoint when the application starts
      supervisor(Gis.Endpoint, []),
      # Start your own worker by calling: Gis.Worker.start_link(arg1, arg2, arg3)
      worker(Longpoll.Dbworker, [[name: Longpoll.Dbworker]]),
      worker(Longpoll.Worker, [[name: Longpoll.Worker]]),
#      worker(Longpoll.Rights, [[name: Longpoll.Rights]], id: :lr0),
      # @TODO: Move it to separate supervisor
      worker(Longpoll.Rights, [[name: Rights1]], id: :lr1),
      worker(Longpoll.Rights, [[name: Rights2]], id: :lr2),
      worker(Longpoll.Rights, [[name: Rights3]], id: :lr3),
      worker(Longpoll.Rights, [[name: Rights4]], id: :lr4),
      worker(Longpoll.Rights, [[name: Rights5]], id: :lr5),
      worker(Longpoll.Rights, [[name: Rights6]], id: :lr6),
      worker(Longpoll.Rights, [[name: Rights7]], id: :lr7),
      worker(Longpoll.Rights, [[name: Rights8]], id: :lr8),
      worker(Longpoll.Rights, [[name: Rights9]], id: :lr9),
      worker(Longpoll.Rights, [[name: Rights10]], id: :lr10),
      :hackney_pool.child_spec(:rights_pool,  [timeout: 30000000, max_connections: 10]),
      :hackney_pool.child_spec(:status_poll,  [timeout: 30000000, max_connections: 1]),
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Gis.Supervisor]
    Supervisor.start_link(children, opts)
end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Gis.Endpoint.config_change(changed, removed)
    :ok
  end
end
