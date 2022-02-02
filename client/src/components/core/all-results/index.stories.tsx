import AllResults from '.';
import mockDivisions from './mock-divisions';

export const allResultsDivisions = (): JSX.Element => (
  <AllResults teams={[]} hasDivisions tournamentDivisions={mockDivisions.divisions} />
);

export default {
  title: 'Components/Core/All Results',
  component: allResultsDivisions,
};
