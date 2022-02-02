import { tournamentStatuses } from 'helpers/pl-types';
import { addMinutes } from 'date-fns';
import TournamentCard from '.';

const status: tournamentStatuses = "PENDING RESULTS";
const mockTournamentData = {
  description: 'Test Title',
  id: 1,
  totalTeams: 13,
  tournamentConfig: {
    configJson: {
      entryFeeValue: 2,
      maximumNumberTeams: 65,
      totalPrizePool: 155,
      startDateTime: '2021-11-23T11:38:00.168Z',
      endDateTime: '2021-11-23T14:38:00.168Z',
      scoringStyleDescription: 'Best of 2 Kills',
      prizeStyleDescription: 'Placement',
      payoutAmounts: [],
      scoringStyle: 'scoring style',
      prizeStyle: 'prize style',
      hasDivisions: false,
      gameInfo: {
        gameModeName: 'Game mode',
        gameModeOptions: {
          teamSizes: [3],
        },
      },
    },
  },
  tournamentStatus: status,
  userFlag: false,
};

export const tournamentCard = (): JSX.Element => (
  <TournamentCard tournament={mockTournamentData} />
);

export const tournamentCardUserJoined = (): JSX.Element => (
  <TournamentCard tournament={{ ...mockTournamentData, userFlag: true }} />
);

export const tournamentCardStartInMinutes = (): JSX.Element => (
  <TournamentCard tournament={{
    description: 'Test Title',
    id: 1,
    totalTeams: 13,
    tournamentStatus: status,
    tournamentConfig: {
      configJson: {
        entryFeeValue: 2,
        maximumNumberTeams: 65,
        totalPrizePool: 155,
        startDateTime: `${addMinutes(Date.now(), 35)}`,
        endDateTime: `${addMinutes(Date.now(), 65)}`,
        payoutAmounts: [],
        scoringStyle: 'scoring style',
        scoringStyleDescription: 'This is a scoring style description',
        prizeStyle: 'prize style',
        prizeStyleDescription: 'This is a prize style description',
        hasDivisions: false,
        gameInfo: {
          gameModeName: 'Game mode',
          gameModeOptions: {
            teamSizes: [3],
          }
        }
      }
    },
    userFlag: false,
  }}
  />
);

export default {
  title: 'Components/Core/Tournament Card',
  component: tournamentCard,
};
