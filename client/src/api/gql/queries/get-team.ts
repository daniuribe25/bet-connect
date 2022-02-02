import { gql } from '@apollo/client';

const getTeams = gql`
  query Team($teamId: String) {
    getTeams(filter: { id: { eq: $teamId } }) {
      id
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
      owner {
        id
        psnPlatformUsername
        xblPlatformUsername
        battlenetPlatformUsername
        wallet {
          funds
        }
      }
      teammates {
        id
        lobbyPlatform
        team {
          id
        }
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
      privateUsers {
        platform
        usernamePlatform
      }
    }
  }
`;

export default getTeams;
