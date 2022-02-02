# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     PlConnect.Repo.insert!(%PlConnect.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias PlConnect.Api

defmodule PlConnect.Seeds do
  def add_user(user) do
    {:ok, user} = user

    args = %{
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
      psn_platform_username: user.psn_platform_username,
      xbl_platform_username: user.xbl_platform_username,
      pl_core_user_id: user.pl_core_user_id
    }

    case Api.create_user_platform_bypass(args) do
      {:ok, user} ->
        Map.take(user, [:id, :email]) |> IO.inspect(label: "inserted")
        :ok

      {:error, error} ->
        %{id: :error, email: args.email, error: error} |> IO.inspect(label: "error inserting")
        :error
    end
  end
end

File.stream!('./seeds.csv')
|> CSV.decode(
  headers: [:pl_core_user_id, :password, :email, :psn_platform_username, :xbl_platform_username, :battlenet_platform_username]
)
|> Enum.map(&PlConnect.Seeds.add_user/1)
|> IO.inspect(label: "complete")
