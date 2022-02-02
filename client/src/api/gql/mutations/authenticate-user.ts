import { gql } from '@apollo/client';

const authenticateUser = gql`
  mutation AuthenticateUser($input: AuthenticateUserInput) {
    authenticateUser(input: $input) {
      errors {
        message
        fields
      }
      result {
        token
        is_admin
      }
    }
  }
`;

export const authenticateUserByPhone = gql`
  mutation AuthenticateUserByPhone($input: AuthenticateByPhoneInput) {
    authenticateByPhone(input: $input) {
      errors {
        message
        fields
      }
      result {
        token
        is_admin
      }
    }
  }
`;

export default authenticateUser;
