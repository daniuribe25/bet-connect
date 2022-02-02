import { gql } from '@apollo/client';

const getUserList = gql`
  query getUserList($search: String) {
    listUsers(
      filter: {
        or: [
          { psnPlatformUsername: { eq: $search } }
          { xblPlatformUsername: { eq: $search } }
          { battlenetPlatformUsername: { eq: $search } }
        ]
      }
    ) {
      count
      results {
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
`;

export default getUserList;
