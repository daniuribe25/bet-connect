import { gql } from '@apollo/client';

const placeTeamBet = gql`
  mutation placeTeamBet($input: PlaceTeamBetInput) {
    placeTeamBet(input: $input) {
      errors {
        message
        fields
      }
      result {
        id
        betTotalAmount
        status
        insertedAt
        map
        resultMatchCodId
        requiredResult {
          betAmount
          rewardedAmount
          type
          value
          won
        }
        team {
          isActive
          id
          squadSize
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
`;

export default placeTeamBet;
