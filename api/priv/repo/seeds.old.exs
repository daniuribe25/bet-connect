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
alias PlConnect.Cod.User
alias PlConnect.ApiClient.V1CodTrackerGG

Faker.start()

amount_of_user_per_platform = 10

psn_users =
  V1CodTrackerGG.get_leaderboards("psn", amount_of_user_per_platform)
  |> Access.fetch!("items")
  |> Enum.map(fn x ->
    metadata = x["owner"]["metadata"]

    platform = metadata["platformSlug"]
    username = metadata["platformUserIdentifier"]

    {xbl, psn} =
      if platform == "psn" do
        {nil, username}
      else
        {username, nil}
      end

    %{
      psn_platform_username: psn,
      xbl_platform_username: xbl
    }
  end)

xbl_users =
  V1CodTrackerGG.get_leaderboards("xbl", amount_of_user_per_platform)
  |> Access.fetch!("items")
  |> Enum.map(fn x ->
    metadata = x["owner"]["metadata"]

    platform = metadata["platformSlug"]
    username = metadata["platformUserIdentifier"]

    {xbl, psn} =
      if platform == "psn" do
        {nil, username}
      else
        {username, nil}
      end

    %{
      psn_platform_username: psn,
      xbl_platform_username: xbl
    }
  end)

cod_users = psn_users ++ xbl_users

cod_users
|> Stream.map(fn user ->
  Api.create_user_platform_bypass(%{
    id: UUID.uuid4(),
    email: Faker.Person.first_name() <> Faker.Person.last_name() <> "@gmail.com",
    password: "Password2020",
    password_confirmation: "Password2020",
    psn_platform_username: user.psn_platform_username,
    xbl_platform_username: user.xbl_platform_username
  })
end)
|> Enum.to_list()
