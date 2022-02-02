defmodule PlConnect.External.CodPlayPython do
  @moduledoc """
  Send the given data into the python code tool for being processed and returns the result

  TODO: Make sure this scales later on
  """

  require Logger

  @doc """
  Calls python code with the given processed data and return the probabilities for verdansk
  """
  def process(data) do
    python_script = Path.join(["#{:code.priv_dir(:pl_connect)}", "pl-codplay-master", "main.py"])

    {json, 0} = System.cmd("python3", [python_script, Jason.encode!(data)])

    Jason.decode!(json)
  end

  @doc """
  Calls python code with the given processed data and return the probabilities for rebirth
  """
  def process_rebirth(data) do
    python_script =
      Path.join(["#{:code.priv_dir(:pl_connect)}", "pl-codplay-master", "main_rebirth.py"])

    {json, 0} = System.cmd("python3", [python_script, Jason.encode!(data)])

    Jason.decode!(json)
  end

  @doc """
  Turns player data into python format
  """
  def player_match_to_python(matches, bet) do
    try do
      data =
        matches
        |> Enum.map(fn x ->
          %{
            username: x.platform_username,
            kills: x.kills,
            damage: x.damage,
            placement: x.placement
          }
        end)
        |> Enum.group_by(
          & &1.username,
          &%{Kills: trunc(&1.kills), Damage: trunc(&1.damage), Placement: trunc(&1.placement)}
        )
        |> Enum.map(fn {name, data} -> %{name: name, data: data} end)

      %{
        bet: bet,
        players: data
      }
    rescue
      error ->
        Logger.error(error)
    end
  end
end
