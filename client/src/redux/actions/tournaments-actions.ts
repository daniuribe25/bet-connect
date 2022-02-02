import { createAsyncThunk } from '@reduxjs/toolkit';
import http from 'api/http';
import { AlertType } from 'helpers/pl-types';
import { buildMessages, uuidv4 } from '../../helpers/common';

const tourneyBaseUrl = 'api/tournaments';

export const getAllTournaments = createAsyncThunk(
  'tournaments',
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await http.get(`${tourneyBaseUrl}`, {})
      const tournaments: any = response?.data?.tournaments || [];
      return { tournaments };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const getTournament = createAsyncThunk(
  'tournaments/id',
  async (tourneyId: any, { rejectWithValue }) => {
    try {
      const response: any = await http.get(`${tourneyBaseUrl}/${tourneyId}`, {})
      const tournament: any = response?.data?.tournament;
      return { tournament };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const getUserTournamentHistory = createAsyncThunk(
  'tournaments/history',
  async () => {
    try {
      const response: any = await http.get(`${tourneyBaseUrl}/history`, {})
      const tournament: any = response?.data?.tournament;
      return tournament;
    } catch (err: any) {
      return buildMessages([err.message], 'error')
    }
  },
);

export const joinTournament = createAsyncThunk(
  'tournaments/joinTourney',
  async ({ tourneyId, teamId }: {tourneyId: number, teamId: string }, { rejectWithValue }) => {
    try {
      await http.post(`${tourneyBaseUrl}/${tourneyId}/join`, { tourney_id: tourneyId, team_id: teamId })
      const alerts: AlertType = {
        id: uuidv4(),
        messages: [
          {
            text: 'Your team has successfully joined the tournament',
            title: 'Success!',
            type: 'success',
          },
        ],
      };
      return { alerts };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const leaveTournament = createAsyncThunk(
  'tournaments/leaveTourney',
  async ({ tourneyId, teamId }: {tourneyId: number, teamId: string }, { rejectWithValue }) => {
    try {
      await http.post(`${tourneyBaseUrl}/${tourneyId}/leave`, { tourney_id: tourneyId, team_id: teamId })
      const alerts: AlertType = {
        id: uuidv4(),
        messages: [
          {
            text: 'Your team has left the tournament',
            title: 'Success!',
            type: 'info',
          },
        ],
      };
      return { alerts };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);
