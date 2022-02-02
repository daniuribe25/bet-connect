import { gql } from '@apollo/client';

const addFunds = gql`
  mutation AddFunds($id: ID, $input: PaypalTransactionProcessInput) {
    paypalTransactionProcess(id: $id, input: $input) {
      errors {
        message
        fields
      }
      result {
        id
        wallet {
          funds
        }
      }
    }
  }
`;

export default addFunds;
