import { gql } from '@apollo/client';

const updateUserPassword = gql`
  mutation updateUserPassword($id: ID, $input: UpdateUserPasswordInput) {
    updateUserPassword(id: $id, input: $input) {
      errors {
        message
      }
      result {
        id
      }
    }
  }
`;

export const resetUserPassword = gql`
  mutation adminUpdateUserPassword(
    $id: ID
    $input: AdminUpdateUserPasswordInput
  ) {
    adminUpdateUserPassword(id: $id, input: $input) {
      errors {
        message
      }
      result {
        id
      }
    }
  }
`;

export const recoverUserPasswordWithEmail = gql`
  mutation resetPassword($id: ID) {
    resetPassword(id: $id) {
      errors {
        fields
        message
      }
      result {
        id
      }
    }
  }
`;

export default updateUserPassword;
