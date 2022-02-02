/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { AlertType, SignupSteps } from '../../helpers/pl-types';
import { trackIdentity, trackLogIn } from '../../helpers/segment-analytics';
import storage, { AUTH_TOKEN, TEAM_ID } from '../../helpers/storage';
import {
  addFunds,
  authUser,
  changePassword,
  loadUser,
  recoverPassword,
  registerUserbyStep,
  verifyEmailAddress,
  verifyPrivateProfile,
} from '../actions/session-actions';

const initialState: SessionState = {
  isFetching: true,
  alerts: {},
  authToken: null,
  signupToken: null,
  currentUser: null,
  openIntercom: false,
  openFaq: false,
  loading: false,
  signupStep: SignupSteps.phoneVerification,
  userToSignup: null,
};

const pendingCallback = (state: SessionState): void => {
  state.loading = true;
};

const rejectCallback = (state: SessionState, { payload }: any): void => {
  state.loading = false;
  state.alerts = payload;
};

const sessionSlice = createSlice({
  name: 'Session',
  initialState,
  reducers: {
    setStoreProperty(state, { payload: [key, value] }: any) {
      // @ts-ignore
      state[key] = value;
    },
    logout(state) {
      state = initialState;
      return state;
    },
    handleSessionErrors(state, { payload }: any) {
      state = { ...initialState };
      state.alerts = payload;
      state.isFetching = false;
      storage.remove(AUTH_TOKEN);
      storage.remove(TEAM_ID);
      state.authToken = null;
      state.currentUser = null;
      return state;
    },
  },
  extraReducers: (builder) => {
    // load cache
    builder.addCase(loadUser.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      if (!payload.currentUser) {
        state = { ...initialState };
        state.isFetching = false;
        storage.remove(AUTH_TOKEN);
        storage.remove(TEAM_ID);
        state.authToken = null;
        state.currentUser = null;
      } else {
        state.authToken = payload.token;
        state.currentUser = payload.currentUser;
        trackIdentity(payload.currentUser);
      }
    });
    // authenticate
    builder.addCase(authUser.pending, pendingCallback);
    builder.addCase(authUser.fulfilled, (state, { payload }: any) => {
      state.isFetching = false;
      state.loading = false;
      state.currentUser = payload.user;
      state.authToken = payload.token;
      trackLogIn();
      trackIdentity(payload.user);
    });
    builder.addCase(authUser.rejected, rejectCallback);
    // update User Password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(changePassword.fulfilled, (state, { payload }: any) => {
      state.loading = false;
      state.alerts = payload.alerts;
    });
    builder.addCase(changePassword.rejected, (state, { payload }: any) => {
      state.loading = false;
      state.alerts = payload;
    });

    builder.addCase(recoverPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(recoverPassword.fulfilled, (state, { payload }: any) => {
      state.loading = false;
      state.alerts = payload.alerts;
    });
    builder.addCase(recoverPassword.rejected, (state, { payload }: any) => {
      state.loading = false;
      state.alerts = payload;
    });

    // registration by steps
    builder.addCase(registerUserbyStep.pending, pendingCallback);
    builder.addCase(registerUserbyStep.fulfilled, (state, { payload }: any) => {
      state.isFetching = false;
      state.loading = false;
      state.userToSignup = payload.user;
      if (state.currentUser) { state.currentUser = payload.user; }
      state.alerts = payload.alerts;
      const token = payload.token || state.signupToken;
      state.signupToken = token;
      if (token) {
        storage.save(AUTH_TOKEN, token);
      }
      state.signupStep = payload.nextStep;
    });
    builder.addCase(registerUserbyStep.rejected, rejectCallback);

    // Add funds
    builder.addCase(addFunds.pending, pendingCallback);
    builder.addCase(addFunds.fulfilled, (state, { payload }: any) => {
      state.loading = false;
      state.currentUser = { ...state.currentUser, wallet: payload.wallet };
    });
    builder.addCase(addFunds.rejected, rejectCallback);

    // verify private profile
    builder.addCase(verifyPrivateProfile.pending, pendingCallback);
    builder.addCase(
      verifyPrivateProfile.fulfilled,
      (state, { payload }: any) => {
        state.loading = false;
        state.currentUser = {
          ...state.currentUser,
          privateProfile: payload?.user?.privateProfile,
        };
      },
    );
    builder.addCase(verifyPrivateProfile.rejected, rejectCallback);

    // verify user email address
    builder.addCase(verifyEmailAddress.pending, pendingCallback);
    builder.addCase(verifyEmailAddress.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(verifyEmailAddress.rejected, rejectCallback);

  },
});

const { reducer, actions } = sessionSlice;

export const { setStoreProperty, logout, handleSessionErrors } = actions;
export default reducer;

export type SessionState = {
  authToken: string | null;
  isFetching: boolean;
  alerts: AlertType;
  currentUser: any;
  openIntercom: boolean;
  openFaq: boolean;
  loading: boolean;
  signupStep: SignupSteps;
  signupToken: string | null;
  userToSignup: any;
};
