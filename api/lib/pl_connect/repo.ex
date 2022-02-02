defmodule PlConnect.Repo do
  use AshPostgres.Repo,
    otp_app: :pl_connect
end
