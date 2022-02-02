defmodule PlConnect.MatchUpdateTest do
  use PlConnect.DataCase, async: true
  use Oban.Testing, repo: PlConnect.Repo

  import PlConnect.TestHelpers

  require Ash.Query

  test "should queue up an insert if no user matches exist" do
    [user] = create_players(1)

    %{user_id: user.id, platform: "psn"}
    |> PlConnect.Workers.Match.Update.new()
    |> Oban.insert()

    assert_enqueued(worker: PlConnect.Workers.Match.Update, args: %{user_id: user.id, platform: "psn"})
    assert %{success: 1, failure: 0} = Oban.drain_queue(queue: :updater)

    assert_enqueued(
      worker: PlConnect.Workers.Match.Insert,
      args: %{user_id: user.id, username: user.psn_platform_username, platform: "psn"}
    )
  end
end
