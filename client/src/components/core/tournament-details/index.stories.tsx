import TournamentDetails from '.';

const mockDetails = [
  {
    header: 'Kill race tournament',
    description: 'Get as many kills as you can during the time period'
  },
  {
    header: 'Time period',
    description: '6–8pm ET'
  },
  {
    header: 'Team size',
    description: '4 player max'
  },
]

export const tournamentDetails = (): JSX.Element => (
  <TournamentDetails details={mockDetails} />
);

export default {
  title: 'Components/Core/Tournament details',
  component: tournamentDetails,
};
