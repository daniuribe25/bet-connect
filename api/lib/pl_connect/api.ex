defmodule PlConnect.Api do
  @moduledoc false
  use Ash.Api,
    extensions: [
      AshGraphql.Api
    ]

  graphql do
    authorize? true
    stacktraces? true
  end

  resources do
    resource PlConnect.Cod.UserExist
    resource PlConnect.Cod.User
    resource PlConnect.Cod.Session
    resource PlConnect.Cod.Team
    resource PlConnect.Cod.Team.TeamUsers
    resource PlConnect.Cod.PlayerMatch
    resource PlConnect.Cod.UserBetHistory
    resource PlConnect.Cod.WalletTransaction
    resource PlConnect.Cod.Feature
    resource PlConnect.InviteLobby
    resource PlConnect.Cod.SummaryStats
    resource PlConnect.Berbix
    resource PlConnect.Cod.BetValues
    resource PlConnect.Cod.WzrankedProbabilities
    resource PlConnect.Report
    resource PlConnect.Cod.RebirthLine
  end
end
