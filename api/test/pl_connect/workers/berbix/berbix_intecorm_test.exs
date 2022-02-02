defmodule PlConnect.BerbixIntecormTest do
  use PlConnect.DataCase, async: false
  use Oban.Testing, repo: PlConnect.Repo

  import PlConnect.TestHelpers

  alias PlConnect.Api
  alias PlConnect.Workers.Berbix.NotifyInactivity

  setup do
    Tesla.Mock.mock_global(fn
      %{method: :post, url: "https://api.intercom.io/conversations", body: _} ->
        %Tesla.Env{status: 200, body: %{"id" => "test"}}
    end)

    :ok
  end

  test "should return nil because the user its activated" do
    user = create_players(1)
      |> Enum.at(0)
      |> Api.update_user_age_verified!(%{"age_verified" => true})


    NotifyInactivity.new(%{user_id: user.id})
    |> Oban.insert()

    assert {:ok, nil} = perform_job(NotifyInactivity, %{user_id: user.id})
  end

  test "perform the call to intercom" do
    [user] = create_players(1)

    NotifyInactivity.new(%{user_id: user.id})
    |> Oban.insert()

    assert {:ok, {:ok, resp}} = perform_job(NotifyInactivity, %{user_id: user.id})
    assert resp.status == 200
  end

end