import { gql } from '@apollo/client';

const createUser = gql`
  mutation CreateUser($input: CreateUserInput) {
    createUser(input: $input) {
      errors {
        message
        fields
      }
      result {
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

export default createUser;
