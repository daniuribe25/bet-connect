import { gql } from '@apollo/client';

const confirmPrivateProfile = gql`
  mutation UpdateProfileStatus($id: ID) {
    updateProfileStatus(id: $id) {
      errors {
        message
        fields
      }
      result {
        id
        phone
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

export default confirmPrivateProfile;
