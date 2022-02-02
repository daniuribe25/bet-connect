import AllTournaments from './index';
import mockTournaments from './mock-data';

export const tournaments = (): JSX.Element => (
  <AllTournaments tournaments={mockTournaments} />
);

export default {
  title: 'Components/Organisms/All Tournaments',
  component: tournaments,
};
