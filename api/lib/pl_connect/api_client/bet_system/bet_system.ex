defmodule PlConnect.ApiClient.BetSystem do
  @moduledoc """
  Api wrapper for the warzone api for tracker.gg
  """
  use Tesla

  plug Tesla.Middleware.BaseUrl, "https://pl-bet-system.herokuapp.com"
  plug Tesla.Middleware.JSON
  plug PlConnect.ApiClient.Middleware.CacheMatches, ttl: :timer.minutes(40)
  plug Tesla.Middleware.Compression, format: "gzip"

  @doc """
    ### Arguments:
          players: [ %{ gamer, platform }]
          modename: ["Solos","Duos", "Trios", "Quads", "Rebirth: Resurgence", "Vanguard Resurgence"]
          dataset:  total or totalModes or top or latest or IQR
          maxPayout: number bigger than 1, default 10x (this is how many times the house will pay what you bet)
          limit: number of matches that will be take into account to create the lines
          filter: number. Max probability that a team can have for a bet


  ### Example 1
    iex>  PlConnect.ApiClient.BetSystem.get_team_betlines!([ %{ gamer: "wooldynasty", platform: "psn"}, %{ gamer: "PlZach", platform: "psn"}], ["Quads"], "latest", 10, 40, 80)

    Returns %{
  "damagedone" => %{
    "hard" => %{
      "Payout" => 10,
      "Percent" => 10.23480392636596,
      "Quantity" => 7283
    },
    "medium" => %{"Payout" => 3, "Percent" => 35, "Quantity" => 2924},
    "rookie" => %{
      "Payout" => 2,
      "Percent" => 79.03313727601022,
      "Quantity" => 765
    }
  },
  "kills" => %{
    "hard" => %{
      "Payout" => 10,
      "Percent" => 10.145089285714286,
      "Quantity" => 18
    },
    "medium" => %{
      "Payout" => 3,
      "Percent" => 33.716517857142854,
      "Quantity" => 9
    },
    "rookie" => %{
      "Payout" => 2,
      "Percent" => 78.05803571428572,
      "Quantity" => 2
    }
  },
  "placement" => %{
    "hard" => %{"Payout" => 8, "Percent" => 13.298192771084338, "Quantity" => 3},
    "medium" => %{
      "Payout" => 3,
      "Percent" => 36.49096385542169,
      "Quantity" => 12
    },
    "rookie" => %{"Payout" => 2, "Percent" => 79.894578313253, "Quantity" => 31}
  }
    }

  """
  def get_team_betlines!(players, modename, dataset, maxPayout, limit, filter) do
    request_body = %{
      players: players,
      modename: modename,
      dataset: dataset,
      maxPayout: maxPayout,
      limit: limit,
      filter: filter
    }

    path = "/teams"

    %{body: body} = post!(path, request_body)
    body
  end
end
