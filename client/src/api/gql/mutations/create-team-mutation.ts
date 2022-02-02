import { gql } from '@apollo/client';

const createTeamMutation = gql`
  mutation CreateTeamMutation($input: CreateTeamInput) {
    createTeam(input: $input) {
      errors {
        message
        fields
      }
      result {
        id
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
        damageBetLevel
        mainBetLevel
        owner {
          id
          ownedTeams {
            id
          }
          psnPlatformUsername
          xblPlatformUsername
          battlenetPlatformUsername
          wallet {
            funds
          }
        }
        placementBetLevel
        teammates {
          id
          lobbyPlatform
          team {
            id
            squadSize
          }
          user {
            id
            ownedTeams {
              id
              squadSize
            }
            psnPlatformUsername
            xblPlatformUsername
            battlenetPlatformUsername
            teams {
              id
            }
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
  }
`;

export default createTeamMutation;
