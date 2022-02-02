import { gql } from '@apollo/client';

const updateTeamMatchResult = gql`
  mutation updateTeamMatchResult($id: ID, $input: UpdateTeamMatchResultInput) {
    updateTeamMatchResult(id: $id, input: $input) {
      errors {
        message
        fields
      }
      result {
        id
        bets {
          expectedDamage {
            rank
            totalPayout {
              diamond
              legend
              rookie
            }
          }
          expectedKillsPrizes {
            diamond
            legend
            rookie
          }
          expectedPlacement {
            rank
            totalPayout {
              diamond
              legend
              rookie
            }
          }
          diamondKills
          legendKills
          rookieKills
        }
        mainBetLevel
        damageBetLevel
        placementBetLevel
        owner {
          wallet {
            funds
          }
        }
        teammates {
          user {
            id
            wallet {
              funds
            }
          }
        }
      }
    }
  }
`;

export default updateTeamMatchResult;
