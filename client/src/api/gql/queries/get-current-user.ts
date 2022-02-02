import { gql } from '@apollo/client';

const getCurrentUser = gql`
  query {
    currentUser {
      id
      psnPlatformUsername
      xblPlatformUsername
      battlenetPlatformUsername
      wallet {
        funds
      }
      phone
      email
      ageVerified
      matchesCount
      refreshBerbixToken
      privateProfile
    }
  }
`;

export default getCurrentUser;
