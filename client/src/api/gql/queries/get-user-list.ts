import { gql } from '@apollo/client';

const getUserByGamerTag = gql`
  query RootQueryType($gamerTag: String!) {
    getByGamerTag(username: $gamerTag) {
      id
      psnPlatformUsername
      xblPlatformUsername
      battlenetPlatformUsername
      wallet {
        funds
      }
    }
  }
`;

export default getUserByGamerTag;
