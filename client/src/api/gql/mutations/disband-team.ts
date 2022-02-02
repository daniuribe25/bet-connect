import { gql } from '@apollo/client';

const disbandTeam = gql`
  mutation DisbandTeamRootMutationType($disbandTeamId: ID) {
    disbandTeam(id: $disbandTeamId) {
      result {
        id
        updatedAt
      }
      errors {
        message
      }
    }
  }
`;

export const disbandUserTeam = gql`
  mutation DisbandUserTeam($disbandUserId: ID) {
    disableUserTeams(id: $disbandUserId) {
      errors {
        message
        fields
      }
      result {
        id
      }
    }
  }
`;

export default disbandTeam;
