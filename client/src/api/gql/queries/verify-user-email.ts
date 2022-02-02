import { gql } from '@apollo/client';

const verifyUserEmail = gql`
  mutation VerifyUserEmail($code: String, $email: String) {
    sendEmailVerificationCode(input: {
      code: $code,
      email: $email
    }) {
      errors {
        message
        fields
      }
      result {
        isAdmin
      }
    }
  }
`;

export default verifyUserEmail;
