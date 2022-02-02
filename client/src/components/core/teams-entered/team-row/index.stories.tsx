import styled from 'styled-components';
import TeamRow from '.';

const StoryWrapper = styled.div`
  background-color: #EAF0F5;
`;

export const teamRow = (): JSX.Element => (
  <StoryWrapper>
    <TeamRow
      team={{
        id: '1',
        teamId: '1',
        teamName: 'Team 1234',
        tournamentTeamUser: [
          {
            playerHandle: 'member1234',
            userId: '123',
            id: '123',
            balancePaid: true,
          },
          {
            playerHandle: 'member2345',
            userId: '1234',
            id: '123',
            balancePaid: true,
          },
          {
            playerHandle: 'member3456',
            userId: '12345',
            id: '123',
            balancePaid: true,
          },
          {
            playerHandle: 'member4567',
            userId: '123456',
            id: '123',
            balancePaid: true,
          }
        ]
      }}
    />
  </StoryWrapper>
);

export default {
  title: 'Components/Core/Teams Entered/Team Row',
  component: teamRow,
};
