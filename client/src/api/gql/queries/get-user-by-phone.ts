import { gql } from '@apollo/client';

const getUserByPhone = gql`
  query GetUserByPhone($phone: String) {
    getUserByPhone(phone: $phone) {
      id
    }
  }
`;

export default getUserByPhone;
