import { render } from 'unit-test-utils';
import TeamAvatars from '.';

test('renders welcome message', () => {
  const { getByText } = render(
    <TeamAvatars
      team={[
        { playerTag: 'taco' },
        { playerTag: 'cheese' },
        { playerTag: 'lettuce' },
        { playerTag: 'hotsauce' }
      ]}
    />
  );
  expect(getByText('T')).toBeInTheDocument();
  expect(getByText('C')).toBeInTheDocument();
  expect(getByText('L')).toBeInTheDocument();
  expect(getByText('H')).toBeInTheDocument();
});
