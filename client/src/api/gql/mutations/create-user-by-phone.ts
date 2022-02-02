import { gql } from '@apollo/client';

const createUserByPhone = gql`
  mutation CreateUserByPhone($input: CreateAccountStepOneInput) {
    createAccountStepOne(input: $input) {
      errors {
        message
        fields
      }
      result {
        id
        phone
        wallet {
          funds
        }
        stepRegister
      }
    }
  }
`;

export default createUserByPhone;

export const getUserByPhone = gql`
  query GetUserByPhone($phone: String) {
    getUserByPhone(phone: $phone) {
      id
      phone
      email
      stepRegister
      xblPlatformUsername
      psnPlatformUsername
      battlenetPlatformUsername
      ageVerified
      wallet {
        funds
      }
      privateProfile
    }
  }
`;

export const getUserByEmail = gql`
  query GetUserByEmail($email: String) {
    getUserByEmail(email: $email) {
      id
      phone
      email
      stepRegister
      xblPlatformUsername
      psnPlatformUsername
      battlenetPlatformUsername
      ageVerified
      wallet {
        funds
      }
      privateProfile
    }
  }
`;

export const updateGamerTagsMutation = gql`
  mutation createAccountStepTwo($input: CreateAccountStepTwoInput, $id: ID) {
    createAccountStepTwo(input: $input, id: $id) {
      errors {
        message
        fields
      }
      result {
        id
        phone
        email
        stepRegister
        xblPlatformUsername
        psnPlatformUsername
        battlenetPlatformUsername
        ageVerified
        wallet {
          funds
        }
        privateProfile
      }
    }
  }
`;

export const updateUserPasswordMutation = gql`
  mutation createAccountStepThree(
    $input: CreateAccountStepThreeInput
    $id: ID
  ) {
    createAccountStepThree(input: $input, id: $id) {
      errors {
        message
        fields
      }
      result {
        id
        phone
        email
        stepRegister
        xblPlatformUsername
        psnPlatformUsername
        battlenetPlatformUsername
        ageVerified
        wallet {
          funds
        }
        privateProfile
      }
    }
  }
`;
