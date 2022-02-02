import { render } from 'unit-test-utils';
import TournamentLabel from '.';

test('renders free label', () => {
  const { getByText } = render(
    <TournamentLabel
      userFlag={false}
      entryFee={0}
      usersTeam={{
        placement: null,
        payoutObject: null,
      }}
      tournamentStatus="NOT STARTED"
    />
  );
  expect(getByText('Free entry')).toBeInTheDocument();
});

test('renders label with entry fee', () => {
  const { getByText } = render(
    <TournamentLabel
      userFlag={false}
      entryFee={5}
      usersTeam={{
        placement: null,
        payoutObject: null,
      }}
      tournamentStatus="NOT STARTED"
    />
  );
  expect(getByText('$5 entry')).toBeInTheDocument();
});

test('renders joined label', () => {
  const { getByText } = render(
    <TournamentLabel
      userFlag={true}
      entryFee={5}
      usersTeam={{
        placement: null,
        payoutObject: null,
      }}
      tournamentStatus="NOT STARTED"
    />
  );
  expect(getByText('Joined')).toBeInTheDocument();
});

test('renders placement label for user that won money', () => {
  const { getByText } = render(
    <TournamentLabel
      userFlag={true}
      entryFee={5}
      usersTeam={{
        placement: 1,
        payoutObject: { value: 100 }
      }}
      tournamentStatus="COMPLETE"
    />
  );
  expect(getByText('Won $100 | 1st')).toBeInTheDocument();
});

test('renders placement label for user that did not win money', () => {
  const { getByText } = render(
    <TournamentLabel
      userFlag={true}
      entryFee={5}
      usersTeam={{
        placement: 7,
        payoutObject: null,
      }}
      tournamentStatus="COMPLETE"
    />
  );
  expect(getByText('Finished 7th')).toBeInTheDocument();
});
