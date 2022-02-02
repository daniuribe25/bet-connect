import TeamsEntered from '.';
import mockTeams from './mock-data'
import mockDivisions from './mock-divisions';

export const teamsEntered = (): JSX.Element => (
  <TeamsEntered teamsData={mockTeams} hasDivisions={false} tournamentDivisions={[]} />
);

export const teamsEnteredWithDivisions = (): JSX.Element => (
  <TeamsEntered teamsData={mockTeams} hasDivisions tournamentDivisions={mockDivisions.divisions} />
);

export default {
  title: 'Components/Core/Teams Entered',
  component: teamsEntered,
};
