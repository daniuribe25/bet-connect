import { gql } from '@apollo/client';

const getUserTeams = gql`
  query getUserTeams(
    $listUsersFilter: UserFilterInput
    $teamsSort: TeamUsersSortInput
  ) {
    listUsers(filter: $listUsersFilter) {
      results {
        id
        teams(
          filter: { team: { isActive: { eq: true }} },
          sort: $teamsSort,
          limit: 1
        ) {
          team {
            id
            isActive
            matchMap
            squadSize
            probabilities {
              gameMode
            }
            probabilitiesGenerated {
              gameMode
            }
            probabilitiesCalculated {
              betCategory
              gameMode
              betLines {
                damage {
                  goal
                  payout
                  level
                }
                kills {
                  goal
                  payout
                  level
                }
                match {
                  goal
                  payout
                  level
                }
                placement {
                  goal
                  payout
                  level
                }
                main {
                  goal
                  payout
                  level
                }
              }
            }
            placementBetLevel
            damageBetLevel
            mainBetLevel
            betHistory {
              id
              status
              betFormat
              insertedAt
              requiredResult {
                betAmount
                rewardedAmount
                type
                value
                won
              }
            }
            owner {
              id
            }
            teammates {
              lobbyPlatform
              user {
                id
                psnPlatformUsername
                xblPlatformUsername
                battlenetPlatformUsername
                wallet {
                  funds
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default getUserTeams;
