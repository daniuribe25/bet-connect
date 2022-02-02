import { gql } from '@apollo/client';

const createBerbixToken = gql`
  mutation createBerbixToken($input: CreateBerbixTokenInput) {
    createBerbixToken(input: $input) {
      errors {
        message
        fields
      }
      result {
        token
      }
    }
  }
`;

export default createBerbixToken;
