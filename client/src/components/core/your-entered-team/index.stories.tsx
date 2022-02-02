import styled from 'styled-components';
import YourEnteredTeams from '.';

const StoryWrapper = styled.div`
  background-color: #EAF0F5;
`;

export const yourEnteredTeam = (): JSX.Element => (
  <StoryWrapper>
    <YourEnteredTeams
      openCancelTeamEntryModal={() => {}}
      team={{
        id: '1',
        teamId: '1',
        teamName: 'team name',
        tournamentTeamUser: [
          {
            playerHandle: 'member1234',
            userId: '1',
            id: '123',
            balancePaid: true,
          },
          {
            playerHandle: 'member2345',
            userId: '2',
            id: '123',
            balancePaid: true,
          },
          {
            playerHandle: 'member3456',
            userId: '3',
            id: '123',
            balancePaid: true,
          },
          {
            playerHandle: 'member4567',
            userId: '4',
            id: '123',
            balancePaid: true,
          }
        ]
      }}
    />
  </StoryWrapper>
);

export default {
  title: 'Components/Core/Your Entered Team',
  component: yourEnteredTeam,
};
