import LiveLeaderboard from '.';
import mockTournament from './mock-tournament';
import mockTournamentNonParticipant from './mock-tournament-non-participant';

export const liveLeaderboard = (): JSX.Element => (
  <LiveLeaderboard tournament={mockTournament} />
);

export const liveLeaderboardNonParticipant = (): JSX.Element => (
  <LiveLeaderboard tournament={mockTournamentNonParticipant} />
);

export default {
  title: 'Components/Organisms/Live Scoreboard/Leaderboard',
  component: liveLeaderboard,
};
