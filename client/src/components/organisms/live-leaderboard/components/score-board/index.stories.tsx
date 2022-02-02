import mockTournament from 'components/organisms/live-leaderboard/mock-tournament';
import { ScoreboardRow, Scoreboard } from '.';

const mockRow = {
  id: '1234',
  placement: 1,
  payoutObject: { value: 500, isApproved: false, type: 'currency' },
  teamId: '123456',
  teamName: "Eevee's team",
  tournamentTeamUser: [],
  teamPrimaryMetricTotal: 123,
  teamSecondaryMetricTotal: 12,
  isUsersTeam: true,
  teamIsInTheMoney: true,
}

export const scoreboardRowNonParticipant = (): JSX.Element => (
  <ScoreboardRow
    tournamentTeam={{
      ...mockRow,
      isUsersTeam: false,
      teamIsInTheMoney: false,
      placement: 8,
      payoutObject: null,
      teamPrimaryMetricTotal: 22,
    }}
  />
);

export const scoreboardRowNonParticipantInTheMoney = (): JSX.Element => (
  <ScoreboardRow tournamentTeam={{ ...mockRow, isUsersTeam: false }} />
);

export const scoreboardRowUsersTeamInTheMoney = (): JSX.Element => (
  <ScoreboardRow tournamentTeam={mockRow} />
);

export const scoreboardRowUsersTeamNotInTheMoney = (): JSX.Element => (
  <ScoreboardRow
    tournamentTeam={{
      ...mockRow,
      teamIsInTheMoney: false,
      payoutObject: null,
      placement: 12,
    }}
    />
);

export const scoreboard = (): JSX.Element => (
  <Scoreboard tournamentTeams={mockTournament.divisions[0].divisionTeams} />
);

export default {
  title: 'Components/Organisms/Live Scoreboard/Scoreboard',
  component: scoreboardRowNonParticipant,
};
