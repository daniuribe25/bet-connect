import { PayoutAmounts, TournamentTeam } from 'helpers/pl-types';
import TournamentRankingPreview from './tournament-ranking-preview';

const mockTeams: Array<TournamentTeam> = [
  {
    id: '1',
    placement: 1,
    payoutObject: {
      isApproved: false,
      type: 'currency',
      value: 5000,
    },
    teamId: '1',
    teamName: 'Robot',
    teamPrimaryMetricTotal: 60,
    teamIsInTheMoney: true,
    tournamentTeamUser: [
      {
        balancePaid: false,
        id: '1',
        playerHandle: 'TheYorkshireBear',
        userId: '1626a76e-ffb6-4d4d-b310-a3b2919ca468',
      },
      {
        balancePaid: false,
        id: '2',
        playerHandle: 'AT80',
        userId: '3fc6ce83-926a-4643-b129-0110cd24d6ee',
      },
    ],
  },
  {
    id: '2',
    placement: 2,
    payoutObject: {
      isApproved: false,
      type: 'currency',
      value: 1000,
    },
    teamId: '2',
    teamName: 'Alien',
    teamPrimaryMetricTotal: 58,
    teamIsInTheMoney: true,
    tournamentTeamUser: [
      {
        balancePaid: false,
        id: '1',
        playerHandle: 'TheYorkshireBear',
        userId: '1626a76e-ffb6-4d4d-b310-a3b2919ca468',
      },
      {
        balancePaid: false,
        id: '2',
        playerHandle: 'AT80',
        userId: '3fc6ce83-926a-4643-b129-0110cd24d6ee',
      },
    ],
  },
  {
    id: '3',
    placement: 3,
    payoutObject: {
      isApproved: false,
      type: 'currency',
      value: 500,
    },
    teamId: '3',
    teamName: 'Monster',
    teamIsInTheMoney: true,
    teamPrimaryMetricTotal: 12,
    tournamentTeamUser: [
      {
        balancePaid: false,
        id: '1',
        playerHandle: 'TheYorkshireBear',
        userId: '1626a76e-ffb6-4d4d-b310-a3b2919ca468',
      },
      {
        balancePaid: false,
        id: '2',
        playerHandle: 'AT80',
        userId: '3fc6ce83-926a-4643-b129-0110cd24d6ee',
      },
    ],
  },
  {
    id: '4',
    placement: 4,
    payoutObject: {
      isApproved: false,
      type: 'currency',
      value: 50,
    },
    teamId: '4',
    teamName: 'Mutant',
    teamIsInTheMoney: true,
    teamPrimaryMetricTotal: 9,
    tournamentTeamUser: [
      {
        balancePaid: false,
        id: '1',
        playerHandle: 'TheYorkshireBear',
        userId: '1626a76e-ffb6-4d4d-b310-a3b2919ca468',
      },
      {
        balancePaid: false,
        id: '2',
        playerHandle: 'AT80',
        userId: '3fc6ce83-926a-4643-b129-0110cd24d6ee',
      },
    ],
  },
  {
    id: '5',
    placement: 5,
    teamName: 'Human',
    teamPrimaryMetricTotal: 5,
    teamIsInTheMoney: false,
    teamId: '5',
    tournamentTeamUser: [
      {
        balancePaid: false,
        id: '1',
        playerHandle: 'TheYorkshireBear',
        userId: '1626a76e-ffb6-4d4d-b310-a3b2919ca468',
      },
      {
        balancePaid: false,
        id: '2',
        playerHandle: 'AT80',
        userId: '3fc6ce83-926a-4643-b129-0110cd24d6ee',
      },
    ],
  },
];

const mockPayouts: PayoutAmounts[] = [
  {
    placement: 1,
    value: 1000,
  },
  {
    placement: 2,
    value: 5000,
  },
  {
    placement: 3,
    value: 2000,
  },
  {
    placement: 4,
    value: 100,
  },
  {
    placement: 5,
    value: 10,
  },
];

export const PendingPreview = (): JSX.Element => (
  <TournamentRankingPreview
    tournamentDivisions={[]}
    hasDivisions={false}
    tournamentStatus="PENDING"
    payouts={mockPayouts}
    teams={mockTeams}
  />
);

export const PendingPayoutPreview = (): JSX.Element => (
  <TournamentRankingPreview
    tournamentDivisions={[]}
    hasDivisions={false}
    tournamentStatus="PENDING PAYOUT"
    payouts={mockPayouts}
    teams={mockTeams}
  />
);

export const Completed = (): JSX.Element => (
  <TournamentRankingPreview
    tournamentDivisions={[]}
    hasDivisions={false}
    tournamentStatus="COMPLETE"
    payouts={mockPayouts}
    teams={mockTeams}
  />
);

export default {
  title: 'Components/Core/Tournament Ranking Preview',
  component: PendingPreview,
};
