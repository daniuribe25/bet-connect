defmodule PlConnect.Helpers do
  @timezone Application.get_env(:pl_connect, :time_zone)

  alias PlConnect.Cod.User

  def format_date(date) do
    date
    |> Timex.Timezone.convert(@timezone)
    |> Timex.format!("{0D}-{0M}-{YYYY} {h12}:{m} {AM}")
  end

  def format_date_hour(date) do
    date
    |> Timex.Timezone.convert(@timezone)
    |> Timex.format!("{h12}:{m} {am}")
  end

  def format_dates(date) do
    date
    |> Timex.Timezone.convert(@timezone)
    |> Timex.format!("{0D}/{0M}/{YY}")
  end

  def add_seconds(date, seconds) do
    date
    |> Timex.Timezone.convert(@timezone)
    |> Timex.shift(seconds: seconds)
  end

  def add_hours(date, hours) do
    date
    |> Timex.shift(hours: hours)
  end

  def less_hours(date, hours) do
    date
    |> Timex.shift(hours: -hours)
  end

  def money_format(amount), do: "$#{amount}"

  @doc """
  ### Example
    iex> Helpers.arr_to_string(["User 1", "User 2", "User 3", "User 4"])

    Returns `User 1, User 2, User 3, User 4`.
  """
  def arr_to_string(arr) do
    Enum.join(arr, ", ")
  end

  @doc """
  ### Example
    iex> Helpers.get_username_platform(record.user)

    Returns `xbl_username`.

    Returns `psn_username`.
  """
  def get_username_platform(%Ash.Changeset{data: data}), do: get_username_platform(data)
  def get_username_platform(data) do
    {_, value, _, _} = iterate_platforms(data)
    value
  end

  def get_platform_atom(record), do: get_platform(record) |> String.to_atom()

  @doc """
  ### Example
    iex> Helpers.get_platform(record.user)

    Returns `xbl`.

    Returns `psn`.
  """
  def get_platform(%Ash.Changeset{data: data}), do: get_platform(data)
  def get_platform(data) do
    {_, _, platform, _} = iterate_platforms(data)
    platform
  end

  def get_platform_field(%Ash.Changeset{data: data}), do: get_platform_field(data)
  def get_platform_field(data) do
    {key, _, _, _} = iterate_platforms(data)
    key
  end

  def get_user_platforms(%Ash.Changeset{data: data}), do: get_user_platforms(data)
  def get_user_platforms(data) do
    {_, _, _, platforms} = iterate_platforms(data)
    platforms
  end

  def iterate_platforms(data) do
    [:battlenet_platform_username, :psn_platform_username, :xbl_platform_username]
    |> Enum.reduce(nil, fn key, acc ->
      case Map.get(data, key, acc) do
        nil -> acc
        value ->
          platform = get_platform_name(key)
          platforms = if is_nil(acc), do: [], else: elem(acc, 3)
          {key, value, platform, [platform | platforms]}
      end
    end)
  end

  defp get_platform_name(:psn_platform_username), do: "psn"
  defp get_platform_name(:xbl_platform_username), do: "xbl"
  defp get_platform_name(:battlenet_platform_username), do: "battlenet"

  @doc """
  ### Example 1
    iex> Helpers.text_plural_singular(["User 1", "User 2"], "users", "user")

    Returns `users`.

  ### Example 2
    iex> Helpers.text_plural_singular(["User 1"], "users", "user")

    Returns `user`.
  """
  def text_plural_singular(arr, plural_text, singular_text) do
    if length(arr) > 1 do
      plural_text
    else
      singular_text
    end
  end

  def test(some) do
    IO.inspect(some, label: "some")
    some
  end

  def id_link_format(id),
    do: create_link_new_tab("Match", "/admin/PlConnect/UserBetHistory/show/#{id}") |> display()

  def user_link_format(id),
    do: create_link_new_tab("User", "/admin/PlConnect/User/show/#{id}") |> display()

  def user_owner_format(id),
    do:
      create_link_new_tab(
        "By Owner",
        "/admin/PlConnect/UserBetHistory/read/read_waiting?args[owner_id]=#{id}"
      )
      |> display()

  def user_team_format(id),
    do:
      create_link_new_tab(
        "By Team",
        "/admin/PlConnect/UserBetHistory/read/read_team_waiting?args[team_id]=#{id}"
      )
      |> display()

  def match_link(nil), do: "Not found"

  def match_link(match),
    do:
      create_link_new_tab("CodTracker", "https://cod.tracker.gg/warzone/match/#{match}")
      |> display()

  def element_slug(el), do: slug(el) |> display()

  defp slug(content),
    do:
      "<span style=\"background-color: #91ffdb;padding: 2px 10px;border-radius: 5px;\">#{content}</span>"

  defp create_link_new_tab(text, link),
    do:
      "<a style=\"background-color: #1f2937;color: white;padding: 2px 10px;border-radius: 5px;\" href=\"#{
        link
      }\" target=\"_blank\">#{text}</a>"

  defp display(content), do: {:safe, content}

  def generate_rand(length) when length == "", do: :base64.encode(:crypto.strong_rand_bytes(8))
  def generate_rand(length), do: :base64.encode(:crypto.strong_rand_bytes(length))
end
