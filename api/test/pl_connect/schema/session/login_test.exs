defmodule PlConnect.LoginTest do
  use PlConnect.DataCase, async: false
  use PlConnect.WzrankedMocks

  import PlConnect.TestHelpers

  alias PlConnect.Api
  alias PlConnect.Helpers
  alias PlConnect.Cod.Resource.Team.Changes.SavePrivateUsers

  setup do
    populate_bet_values()
  end

  test "login_phone/2 returns a valid login" do
    [user] = create_players(1)

    assert %{is_admin: false} = Api.authenticate_user!(nil, user.phone, "password_example")
  end

  test "update_profile_status/1" do
    [user] = create_players(1)

    assert %{private_profile: false} = Api.update_profile_status!(user)
  end

  test "create user - Step 1 (by phone)" do
    user = Api.create_user_by_phone!(%{ phone: "999999999" })
    assert user.step_register == :step_1
  end

  test "create user - Step 2 (with platform_username)" do
    # Step 1
    user = Api.create_user_by_phone!(%{ phone: "999999999" })
    # Step 2
    user_with_username = Api.create_username_by_id!(user, %{ psn_platform_username: "username_example" })
    assert user_with_username.step_register == :step_2
  end

  test "create user - Step 3 (with password) with private profile" do
    # Step 1
    user = Api.create_user_by_phone!(%{ phone: "999999999" })
    # Step 2
    user_with_username = Api.create_username_by_id!(user, %{ psn_platform_username: "username_example" })
    # Step 3

    with_mock PlConnect.Neuron.Connection,
              call: fn _body, _options ->
                {:ok,
                  %Neuron.Response{
                    body: %{"errors" => [%{message: "Not permitted: not allowed"}]},
                    status_code: 200,
                    headers: []
                  }}
              end do
      Tesla.Mock.mock(fn
        %{method: :get, __module__: PlConnect.ApiClient.CodTrackerGG} ->
          %Tesla.Env{status: 400, body: nil}
      end)

      user_with_psw = Api.create_password_by_id!(user_with_username, %{ password: "password_example" })
      assert user_with_psw.step_register == :step_3
      assert user_with_psw.private_profile
    end
  end

  test "verify private profile on different ways" do
    [user] = create_players(1)

    platform = Helpers.get_platform(user)
    gamertag = Helpers.get_username_platform(user)

    Tesla.Mock.mock(fn
      %{method: :get, __module__: PlConnect.ApiClient.CodTrackerGG} ->
        %Tesla.Env{status: 400, body: nil}
    end)

    with_mock PlConnect.Neuron.Connection,
              call: fn _body, _options ->
                {:ok,
                  %Neuron.Response{
                    body: %{"errors" => [%{message: "Not permitted: not allowed"}]},
                    status_code: 200,
                    headers: []
                  }}
              end do
      assert {:cod_tracker, false} = SavePrivateUsers.account_visible(gamertag, platform)
    end
  end

end