import {
  TournamentEnded,
  TournamentEnding,
  YourTournamentEntered,
  YourTournamentLive,
  TournamentLive,
  JoinTournament,
  WaitingForCaptain,
  EditTeam,
  TournamentCancelled,
} from '.';

export const tournamentEnded = (): JSX.Element => (
  <TournamentEnded />
);
export const tournamentCancelled = (): JSX.Element => (
  <TournamentCancelled />
);
export const tournamentEnding = (): JSX.Element => {
  return <TournamentEnding finaliseTime={'01:00pm'} />
};
export const yourTournamentEntered = (): JSX.Element => (
  <YourTournamentEntered
    teamUsers={[
      { playerTag: 'testing' },
      { playerTag: 'hello' }
    ]}
    openYourEnteredTeamModal={() => {}}
  />
);
export const yourTournamentLive = (): JSX.Element => (
  <YourTournamentLive
    teamUsers={[
      { playerTag: 'testing' },
      { playerTag: 'hello' }
    ]}
  />
);
export const tournamentLive = (): JSX.Element => (
  <TournamentLive />
);
export const joinTournament = (): JSX.Element => (
  <JoinTournament
    entryFeeValue={5}
    onClick={() => {}}
    handleClickTeam={() => {}}
    teamUsers={[
      { playerTag: 'testing' },
      { playerTag: 'hello' }
    ]}
  />
);
export const waitingForCaptain = (): JSX.Element => (
  <WaitingForCaptain
    teamUsers={[
      { playerTag: 'testing' },
      { playerTag: 'hello' }
    ]}
  />
);
export const editTeam = (): JSX.Element => (
  <EditTeam
    handleClickTeam={() => {}}
    editTeamString="Your team needs 2 more players"
    teamUsers={[
      { playerTag: 'testing' },
      { playerTag: 'hello' }
    ]}
  />
);

export default {
  title: 'Components/Core/Tournament Action Bars',
  component: tournamentEnded,
};
