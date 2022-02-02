import { Tournament } from"helpers/pl-types"

const mockTournaments: Tournament[] = [
  {
    id: 1,
    description: 'Mock Tournament',
    totalTeams: 13,
    tournamentConfig: {
      configJson: {
        entryFeeValue: 2,
        maximumNumberTeams: 28,
        startDateTime: '2021-11-23T11:38:00.168Z',
        endDateTime: '2021-11-23T14:38:00.168Z',
        totalPrizePool: 150,
        payoutAmounts: [],
        scoringStyle: 'scoring style',
        prizeStyle: 'prize style',
        scoringStyleDescription: 'This is the description of the scoring style',
        prizeStyleDescription: 'This is the description of the prize style',
        hasDivisions: false,
        gameInfo: {
          gameModeName: 'Game mode',
          gameModeOptions: {
            teamSizes: [3],
          }
        }

      }
    },
    tournamentStatus: "NOT STARTED",
    tournamentTeams: [],
    userFlag: false,
  },
  {
    id: 2,
    description: 'Mock Tournament',
    totalTeams: 13,
    tournamentConfig: {
      configJson: {
        entryFeeValue: 2,
        maximumNumberTeams: 28,
        startDateTime: '2021-11-23T11:38:00.168Z',
        endDateTime: '2021-11-23T14:38:00.168Z',
        totalPrizePool: 150,
        payoutAmounts: [],
        scoringStyle: 'scoring style',
        prizeStyle: 'prize style',
        scoringStyleDescription: 'This is the description of the scoring style',
        prizeStyleDescription: 'This is the description of the prize style',
        hasDivisions: false,
        gameInfo: {
          gameModeName: 'Game mode',
          gameModeOptions: {
            teamSizes: [3],
          }
        }
      }
    },
    tournamentStatus: "NOT STARTED",
    userFlag: false,
  },
  {
    id: 3,
    description: 'Mock Tournament',
    totalTeams: 13,
    tournamentConfig: {
      configJson: {
        entryFeeValue: 2,
        maximumNumberTeams: 28,
        startDateTime: '2021-11-23T11:38:00.168Z',
        endDateTime: '2021-11-23T14:38:00.168Z',
        scoringStyleDescription: 'This is the description of the scoring style',
        prizeStyleDescription: 'This is the description of the prize style',
        totalPrizePool: 150,
        payoutAmounts: [],
        scoringStyle: 'scoring style',
        prizeStyle: 'prize style',
        hasDivisions: false,
        gameInfo: {
          gameModeName: 'Game mode',
          gameModeOptions: {
            teamSizes: [3],
          }
        }
      }
    },
    tournamentStatus: "NOT STARTED",
    userFlag: false,
  },
  {
    id: 4,
    description: 'Mock Tournament',
    totalTeams: 13,
    tournamentConfig: {
      configJson: {
        entryFeeValue: 2,
        maximumNumberTeams: 28,
        startDateTime: '2021-11-23T11:38:00.168Z',
        endDateTime: '2021-11-23T14:38:00.168Z',
        totalPrizePool: 150,
        payoutAmounts: [],
        scoringStyle: 'scoring style',
        prizeStyle: 'prize style',
        scoringStyleDescription: 'This is the description of the scoring style',
        prizeStyleDescription: 'This is the description of the prize style',
        hasDivisions: false,
        gameInfo: {
          gameModeName: 'Game mode',
          gameModeOptions: {
            teamSizes: [3],
          }
        }
      }
    },
    tournamentStatus: "NOT STARTED",
    userFlag: false,
  },
  {
    id: 5,
    description: 'Mock Tournament',
    totalTeams: 13,
    tournamentConfig: {
      configJson: {
        entryFeeValue: 2,
        maximumNumberTeams: 28,
        startDateTime: '2021-11-23T11:38:00.168Z',
        endDateTime: '2021-11-23T14:38:00.168Z',
        scoringStyleDescription: 'This is the description of the scoring style',
        prizeStyleDescription: 'This is the description of the prize style',
        totalPrizePool: 150,
        payoutAmounts: [],
        scoringStyle: 'scoring style',
        prizeStyle: 'prize style',
        hasDivisions: false,
        gameInfo: {
          gameModeName: 'Game mode',
          gameModeOptions: {
            teamSizes: [3],
          }
        }
      }
    },
    tournamentStatus: "NOT STARTED",
    userFlag: false,
  }
];

export default mockTournaments;
