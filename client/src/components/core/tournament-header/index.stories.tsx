import { addDays, set } from 'date-fns';
import TournamentHeader from '.';

const date = set(Date.now(), { hours: 9, minutes: 0 });
const startAt = new Date(addDays(date, 1)).toDateString();
const endsAt = new Date(addDays(date, 2)).toDateString();

const tournamentData = {
  teamsJoined: 120,
  slotsAvailable: 500,
  startAt,
  endsAt,
  tournamentStatus: 'COMPLETE'
}

export const tournamentHeaderNotStarted = (): JSX.Element => (
  <TournamentHeader
    openTeamsModal={() => {}}
    tournamentData={{ ...tournamentData, tournamentStatus: 'NOT STARTED' }}
  />
);

export const tournamentHeaderStarted = (): JSX.Element => (
  <TournamentHeader
    openTeamsModal={() => {}}
    tournamentData={{ ...tournamentData, tournamentStatus: 'STARTED' }}
  />
);

export const tournamentHeaderComplete = (): JSX.Element => (
  <TournamentHeader
    openTeamsModal={() => {}}
    tournamentData={tournamentData}
  />
);

export const tournamentHeaderPendingPayout = (): JSX.Element => (
  <TournamentHeader
    openTeamsModal={() => {}}
    tournamentData={{ ...tournamentData, tournamentStatus: 'PENDING PAYOUT' }}
  />
);

export const tournamentHeaderPendingResults = (): JSX.Element => (
  <TournamentHeader
    openTeamsModal={() => {}}
    tournamentData={{ ...tournamentData, tournamentStatus: 'PENDING RESULT' }}
  />
);

export default {
  title: 'Components/Core/Tournament Header',
  component: tournamentHeaderNotStarted,
};
