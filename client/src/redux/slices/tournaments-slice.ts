/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import {
  joinTournament,
  leaveTournament,
  getAllTournaments,
  getTournament,
  getUserTournamentHistory
} from 'redux/actions/tournaments-actions';
import { AlertType, DynamicObjType, Tournament } from 'helpers/pl-types';

const initialState: TournamentsState = {
  alerts: {},
  tournaments: [],
  userTournaments: [],
  loading: false,
  userTournamentHistory: [],
};

const pendingCallback = (state: TournamentsState): void => {
  state.loading = true;
};

const rejectCallback = (state: TournamentsState, { payload }: any): void => {
  state.loading = false;
  state.alerts = payload;
};

const sessionSlice = createSlice({
  name: 'Tournament',
  initialState,
  reducers: {
    setStoreProperty(state, { payload: [key, value] }: any) {
      // @ts-ignore
      state[key] = value;
    },
  },
  extraReducers: (builder) => {
    // join tourney
    builder.addCase(joinTournament.pending, pendingCallback);
    builder.addCase(joinTournament.fulfilled, (state, { payload }: DynamicObjType) => {
      state.loading = false;
      state.alerts = payload.alerts;
    });
    builder.addCase(joinTournament.rejected, rejectCallback);
    // leave tourney
    builder.addCase(leaveTournament.pending, pendingCallback);
    builder.addCase(leaveTournament.fulfilled, (state, { payload }: DynamicObjType) => {
      state.loading = false;
      state.alerts = payload.alerts;
    });
    builder.addCase(leaveTournament.rejected, rejectCallback);

    // getAllTournaments
    builder.addCase(getAllTournaments.pending, pendingCallback);
    builder.addCase(getAllTournaments.fulfilled, (state, { payload }: DynamicObjType) => {
      state.tournaments = payload.tournaments;
    });
    builder.addCase(getAllTournaments.rejected, rejectCallback);

    builder.addCase(getTournament.pending, pendingCallback);
    builder.addCase(getTournament.fulfilled, (state, { payload }: DynamicObjType) => {
      state.viewingTournament = payload.tournament;
    });
    builder.addCase(getTournament.rejected, rejectCallback);
    builder.addCase(getUserTournamentHistory.fulfilled, (state, { payload }: DynamicObjType) => {
      state.userTournamentHistory = payload;
    });
    builder.addCase(getUserTournamentHistory.pending, pendingCallback);
    builder.addCase(getUserTournamentHistory.rejected, rejectCallback);
  },
});

const { reducer, actions } = sessionSlice;

export const { setStoreProperty } = actions;
export default reducer;

export type TournamentsState = {
  alerts: AlertType;
  loading: boolean;
  tournaments: Tournament[];
  userTournaments: Tournament[];
  viewingTournament?: Tournament;
  userTournamentHistory?: Tournament[];
};
