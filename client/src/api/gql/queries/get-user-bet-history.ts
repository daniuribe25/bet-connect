import { gql } from '@apollo/client';

export const getUserBetHistory = gql`
  query GetBetHistory($ownerId: String) {
    listUsers(filter: { id: { eq: $ownerId } }) {
      results {
        teams(
          filter: {
            team: { betHistory: { betTotalAmount: { greaterThanOrEqual: 0 } } }
          }
        ) {
          team {
            betHistory {
              id
              betTotalAmount
              status
              insertedAt
              map
              resultMatchCodId
              lobbyStats {
                kda
                kills
                timeAlive
              }
              userStats {
                damage
                deaths
                gulag
                kills
                placement
                platform
                userId
                platformUsername
              }
              requiredResult {
                betAmount
                rewardedAmount
                type
                value
                won
              }
              team {
                squadSize
                isActive
                id
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
    }
  }
`;

export default getUserBetHistory;
