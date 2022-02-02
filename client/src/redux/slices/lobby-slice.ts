/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { GameModeBottomSheetStates } from 'components/game-mode-picker';
import { getGameModeFromMap, getUserPlatform } from 'helpers/common';
import {
  AlertType,
  BetStatus,
  CategoriesType,
  GameModes,
  LobbySteps,
  UserBetHistoryType,
  UserPlayerTag,
} from '../../helpers/pl-types';
import { trackCreateTeam, trackLeftTeam } from '../../helpers/segment-analytics';
import {
  createTeam,
  disbandTeam,
  getAvailablePlayer,
  getBetHistory,
  getTeams,
  loadFeatureFlags,
  loadStep,
  submitBet,
} from '../actions/lobby-actions';

const initialState: LobbyState = {
  isProcessing: false,
  alerts: {},
  step: LobbySteps.none,
  teamUsers: [],
  teamUsersBackup: [],
  playerList: [],
  teamId: null,
  lobbySize: 4,
  bets: null,
  betStatus: 'OPEN',
  betLevels: {
    damageBetLevel: 0,
    placementBetLevel: 0,
    mainBetLevel: 0,
  },
  pickedBets: {
    main: {
      checked: true,
      won: false,
      value: 10,
      payout: 0,
      level: 0,
    },
    killsPrizes: {
      checked: false,
      won: false,
      value: 0,
      payout: 0,
      level: 0,
    },
    placement: {
      checked: false,
      won: false,
      value: 0,
      payout: 0,
      level: 0,
    },
    damage: {
      checked: false,
      won: false,
      value: 0,
      payout: 0,
      level: 0,
    },
    match: {
      checked: false,
      won: false,
      value: 0,
      payout: 0,
      level: 0,
    },
  },
  openHistoryModal: false,
  pickedCategory: 'rookie',
  squadSize: 1,
  gameMode: GameModes.Caldera,
  searchingPlayers: false,
  searchingPlayersValue: '',
  isUpdatingTeam: false,
  userBetHistory: [],
  isPlacingBet: false,
  hasTeam: false,
  teamUpdated: false,
  isCaptain: true,
  currentBet: null,
  activeBetHistory: null,
  restartSocket: 0,
  openDetails: null,
  lobbyId: null,
  userInvitation: null,
  updateWallet: 0,
  featureFlags: null,
  recentPlayers: [],
  openTeamModal: false,
  teamUpdates: null,
  autoCreateSolo: 0,
  gameModeBottomSheetStatus: GameModeBottomSheetStates.closed,
};

const pendingCallback = (state: LobbyState): void => {
  state.isProcessing = true;
};

const rejectCallback = (state: LobbyState, { payload }: any): void => {
  state.isProcessing = false;
  state.alerts = payload;
};

const lobbySlice = createSlice({
  name: 'Lobby',
  initialState,
  reducers: {
    setStoreProperty(state, { payload: [key, value] }: any) {
      if (key === 'teamUsers' && (!value || value.length === 0)) {
        state.restartSocket += 1;
      } else {
        // @ts-ignore
        state[key] = value;
      }
    },
    logout(state) {
      state = initialState;
      return state;
    },
  },
  extraReducers: (builder) => {
    // load step
    builder.addCase(loadStep.fulfilled, (state, { payload }) => {
      // state.bets = payload.lobby.bets;
      state.bets = payload.lobby?.probabilitiesCalculated?.betLines;

      state.teamId = payload.lobby?.id;
      state.betLevels = {
        damageBetLevel: payload.lobby?.damageBetLevel,
        mainBetLevel: payload.lobby?.mainBetLevel,
        placementBetLevel: payload.lobby?.placementBetLevel,
      };
      state.betStatus = payload.betStatus || 'OPEN';
    });

    // get available players
    // builder.addCase(getAvailablePlayer.pending, pendingCallback);
    builder.addCase(getAvailablePlayer.fulfilled, (state, { payload }: any) => {
      state.isProcessing = false;
      state.playerList = payload.playerList;
    });
    // builder.addCase(getAvailablePlayer.rejected, rejectCallback);

    // create team
    builder.addCase(createTeam.pending, pendingCallback);
    builder.addCase(createTeam.fulfilled, (state, { payload }: any) => {
      state.isProcessing = false;
      // state.bets = payload.lobby.bets;
      state.bets = payload.lobby.probabilitiesCalculated.betLines;

      state.teamId = payload.lobby.id;
      if (!state.isUpdatingTeam) {
        state.betLevels = {
          damageBetLevel: payload.lobby.damageBetLevel,
          mainBetLevel: payload.lobby.mainBetLevel,
          placementBetLevel: payload.lobby.placementBetLevel,
        };
      }
      state.step = payload.step;
      state.alerts = payload.alerts;
      state.isUpdatingTeam = false;
      state.teamUpdated = false;
      state.pickedCategory = payload.lobby.probabilitiesCalculated.betCategory.toLowerCase();
      state.squadSize = payload.lobby.squadSize || 1;
      trackCreateTeam(payload.lobby);
    });
    builder.addCase(createTeam.rejected, rejectCallback);

    // submit bets
    builder.addCase(submitBet.pending, (state: LobbyState) => {
      state.isPlacingBet = true;
    });
    builder.addCase(submitBet.fulfilled, (state, { payload }: any) => {
      state.isPlacingBet = false;
      state.betStatus = payload.betStatus;
    });
    builder.addCase(
      submitBet.rejected,
      (state: LobbyState, { payload }: any) => {
        state.isPlacingBet = false;
        state.alerts = payload;
        state.currentBet = payload.betHistory?.id;
        state.activeBetHistory = payload.betHistory;
      },
    );

    // disband team
    builder.addCase(disbandTeam.pending, pendingCallback);
    builder.addCase(disbandTeam.fulfilled, (state, { payload }: any) => {
      state.isProcessing = false;
      state.step = payload.step;
      state.pickedBets = initialState.pickedBets;
      state.teamId = null;
      state.betStatus = 'OPEN';
      state.betLevels = initialState.betLevels;
      state.isUpdatingTeam = false;
      trackLeftTeam();
      if (payload.alerts) {
        state.alerts = payload.alerts;
      }
    });
    builder.addCase(disbandTeam.rejected, rejectCallback);
    // getTeams
    builder.addCase(getTeams.fulfilled, (state, { payload }: any) => {
      const team: any =
        payload?.listUsers?.results[0]?.teams.length &&
        payload?.listUsers?.results[0]?.teams[0].team;
      if (team) {
        state.betLevels = {
          damageBetLevel: team.damageBetLevel,
          mainBetLevel: team.mainBetLevel,
          placementBetLevel: team.placementBetLevel,
        };

        state.gameMode = getGameModeFromMap(team.matchMap);
        const pickedBets: any = JSON.parse(
          JSON.stringify(initialState.pickedBets),
        );

        state.teamId = team.id;
        state.bets = team.probabilitiesCalculated?.betLines;

        state.pickedCategory =
          team.probabilitiesCalculated?.betCategory?.toLowerCase() || 'rookie';

        state.squadSize = team?.squadSize || team.teammates?.length || 1;

        state.pickedBets = pickedBets;
        const teammates: any = [];
        team.teammates.forEach((tm: any) => {
          const userPlatf = getUserPlatform(tm.user);
          teammates.push({
            userId: tm.user.id,
            user: tm.user,
            platform: userPlatf.platform,
            playerTag: userPlatf.username,
          });
        });
        const status =
          team.betHistory?.length &&
          team.betHistory?.some((x: any) => x.status === 'WAITING')
            ? 'WAITING'
            : 'OPEN';
        state.betStatus = status;

        state.isCaptain = team.owner.id === payload.currentUser.id;
        state.step = !state.isCaptain ? LobbySteps.activeBet : LobbySteps.tasks;
        state.teamUsers = teammates;
        state.activeBetHistory = null;
      } else {
        const { currentUser } = payload;
        state.autoCreateSolo += 1;
        state.step = LobbySteps.players;
        const userPlatf = getUserPlatform(currentUser);
        state.teamUsers = [{
          userId: currentUser?.id,
          user: currentUser,
          platform: userPlatf.platform,
          playerTag: userPlatf.username,
        }]
      }
    });
    // Fetch user bet history
    builder.addCase(getBetHistory.pending, (state) => {
      if (state.userBetHistory?.length < 1) pendingCallback(state);
    });
    builder.addCase(getBetHistory.fulfilled, (state, { payload }: any) => {
      state.userBetHistory = payload.betHistory;
      const lastBet = payload.betHistory[0];
      if (lastBet?.team.id === state.teamId) {
        state.currentBet = lastBet?.id;
      }
      const teamBetHistories = payload?.betHistory?.filter(
        (bh: any) => bh.team?.id === state.teamId,
      );
      if (
        teamBetHistories?.length &&
        teamBetHistories[teamBetHistories.length - 1].status === 'COMPLETE'
      ) {
        state.betStatus = teamBetHistories.some(
          (x: any) => x.status === 'WAITING',
        )
          ? 'WAITING'
          : 'OPEN';
        state.teamUsers = state.teamUsers.map((tu: UserPlayerTag) => {
          if (!tu) return tu;
          const clonedUser: any = { ...tu };
          if (payload.teammates?.length) {
            const newUser = payload.teammates.find(
              (x: any) => x.user.id === clonedUser.userId,
            );
            clonedUser.user.wallet.funds = newUser.user.wallet.funds;
          }
          return clonedUser;
        });
      }
      state.isProcessing = false;
    });
    builder.addCase(getBetHistory.rejected, rejectCallback);
    // Load Feature Flags
    builder.addCase(loadFeatureFlags.fulfilled, (state, { payload }: any) => {
      state.featureFlags = payload.featureFlags;
    });
  },
});

const { reducer, actions } = lobbySlice;

export const { setStoreProperty, logout } = actions;
export default reducer;

export type LobbyState = {
  teamUsers: Array<any>;
  playerList: Array<any>;
  recentPlayers: Array<any>;
  isProcessing: boolean;
  alerts: AlertType;
  step: LobbySteps;
  lobbySize: number;
  bets: any;
  betStatus: BetStatus;
  betLevels: any;
  pickedBets: any;
  pickedCategory: CategoriesType;
  teamId: string | null;
  gameMode: GameModes;
  searchingPlayers: boolean;
  searchingPlayersValue: string;
  openHistoryModal: boolean;
  isUpdatingTeam: boolean;
  isPlacingBet: boolean;
  teamUsersBackup: Array<any>;
  userBetHistory: UserBetHistoryType[];
  hasTeam: boolean;
  teamUpdated: boolean;
  isCaptain: boolean;
  currentBet: string | null;
  activeBetHistory: UserBetHistoryType | null;
  restartSocket: number;
  openDetails: any | null;
  featureFlags: any | null;
  lobbyId: string | null;
  userInvitation: UserPlayerTag | null;
  updateWallet: number;
  openTeamModal: boolean;
  teamUpdates: {
    gameMode?: GameModes;
    pickedCategory?: CategoriesType;
  } | null;
  autoCreateSolo: number;
  squadSize: 1 | 2 | 3 | 4;
  gameModeBottomSheetStatus: GameModeBottomSheetStates,
};
