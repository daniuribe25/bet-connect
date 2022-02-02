/* eslint-disable no-shadow */
export type User = Partial<{
  id: string;
  email: string;
  xblPlatformUsername: string;
  psnPlatformUsername: string;
  battlenetPlatformUsername: string;
  wallet: Partial<{ funds: number }>;
  urlPhoto?: string;
}>;

export enum Platforms {
  steam = 'steam',
  battlenet = 'BATTLENET',
  psn = 'PSN',
  xbl = 'XBL',
}

export type uuid = string;

export type Task = {
  id: uuid;
  ante: number | string;
  type: TaskType | string;
  amount: number;
  payout: number;
};

export enum TaskType {
  'killsPrizes',
  'damage',
  'placement',
  'match',
}

export type UserPlayerTag = {
  user: User;
  userId: uuid;
  playerTag: string;
  platform: Platforms;
  // eslint-disable-next-line camelcase
  photo_url?: string;
  invitationStatus?: number;
};

export type AlertType = {
  id?: string;
  messages?: Array<{
    title?: string;
    text: string;
    type: 'error' | 'success' | 'info';
  }>;
};

export const MatchState = {
  OPEN: 'open',
  SETTLED: 'settled',
};

export type CategoriesType = 'rookie' | 'diamond' | 'legend';
export type BetStatus = 'OPEN' | 'WAITING' | 'COMPLETE';
export enum LobbySteps {
  none,
  players,
  tasks,
  report,
  activeBet,
}
export enum GameModes {
  None = -1,
  Verdansk,
  Rebirth,
  Caldera,
}
export const GameStatus = {
  WAITING: 'WAITING',
  COMPLETE: 'COMPLETE',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

export const taskMap: any = {
  MAIN: 'main',
  KILLS: 'killsPrizes',
  PLACEMENT: 'placement',
  DAMAGE: 'damage',
  MATCH: 'match',
};

export interface Owner {
  email: string;
  id: string;
  psnPlatformUsername: string;
  xblPlatformUsername: string;
  battlenetPlatformUsername: string;
}

export interface RequiredResult {
  betAmount: number;
  rewardedAmount: number;
  type: string;
  value: number;
  won: boolean;
}

export interface Teammate {
  lobbyPlatform: string;
  user: User;
  playerTag: string;
}

export interface Team {
  squadSize: number;
  id: string;
  teammates: Teammate[];
}

export type UserStats = {
  damage: number;
  deaths: number;
  gulag: boolean | null;
  kills: number;
  placement: number;
  platform: string;
  userId: string;
  platformUsername: string;
};

export type LobbyStats = {
  kda: number;
  kills: number;
  timeAlive: number;
};

export interface UserBetHistoryType {
  betTotalAmount: number;
  id: string;
  insertedAt: Date;
  map: string;
  owner: Owner;
  requiredResult: RequiredResult[];
  status: string;
  team: Team;
  resultMatchCodId?: string;
  userStats?: Array<UserStats>;
  lobbyStats?: LobbyStats;
}

export enum SignupSteps {
  phoneVerification = 1,
  gamerTag,
  password,
  settings,
  invite,
}

export type PayoutObject = {
  isApproved: boolean;
  type: string;
  value: any;
};

export type TournamentTeamUser = {
  id: string | number;
  userId: string;
  playerHandle: string;
  balancePaid: boolean;
};

export type DetailProps = {
  header: string;
  description: string | JSX.Element;
};

export type TournamentTeam = {
  id: string | number;
  placement?: string | number | null;
  payoutObject?: PayoutObject | null;
  teamId: string;
  teamName: string;
  tournamentTeamUser: Array<TournamentTeamUser>;
  teamPrimaryMetricTotal?: string | number | null;
  teamSecondaryMetricTotal?: number | null;
  isUsersTeam?: boolean;
  teamIsInTheMoney?: boolean;
  target?: ParticipantTargetType;
};

// [
//   {
//       "payout": 50,
//       "positon": 1
//   },
//   {
//       "payout": 20,
//       "position": 2
//   },
//   {
//       "payout": 5,
//       "position": 3
//   }
// ]

export type PayoutAmounts = {
  payout?: number;
  position?: number;
  placement?: number;
  value?: number;
};
export type tournamentStatuses =
  | 'NOT STARTED'
  | 'PENDING RESULTS'
  | 'STARTED'
  | 'PENDING PAYOUT'
  | 'COMPLETE'
  | 'CANCELLED'
  | 'ERROR'
  | string;

export type Tournament = {
  id: number;
  description: string;
  totalTeams: number;
  tournamentConfig: {
    configJson: {
      entryFeeValue: number;
      maximumNumberTeams: number;
      endDateTime: string;
      startDateTime: string;
      totalPrizePool: number;
      payoutAmounts: Array<PayoutAmounts>;
      scoringStyle: string;
      scoringStyleDescription: string;
      prizeStyle: string;
      prizeStyleDescription: string;
      hasDivisions: boolean;
      gameInfo: {
        gameModeName: string;
        gameModeOptions?: {
          teamSizes?: Array<number>;
        };
      };
    };
  };
  divisions?: DivisionType[];
  tournamentStatus: tournamentStatuses
  tournamentTeams?: Array<TournamentTeam>;
  userFlag: boolean;
};

export type DynamicObjType = { [key: string]: any };

export type HistoryItemProps = {
  id: string;
  game: string;
  map: 'VERDANSK' | 'REBIRTH_ISLAND' | 'CALDERA';
  date: string;
  state: string;
  team: Array<any>;
  onClick: (item: any) => void;
  tasks: Array<any>;
  resultMatchCodId?: string;
  index?: number;
  currentBet?: string;
  gameMode: number;
  userStats?: Array<UserStats>;
  lobbyStats?: LobbyStats;
};

export type DivisionType = {
  id: number;
  divisionNumber: number;
  divisionTeams: Array<TournamentTeam>;
}

export type ParticipantTargetType = {
  score: number;
  scoreType: string;
  scoreToPlaceDifference: number;
  direction: string;
  position: number;
  prize: {
    prizeType: string;
    value: string | number;
  },
}

export type ModalType = 'fullscreen' | 'dialog' | 'center';
