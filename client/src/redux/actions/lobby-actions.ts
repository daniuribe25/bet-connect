import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTeam, getUserBetHistory } from 'api/gql/queries';
import storage, { LAST_BET_TIME, TEAM_ID } from 'helpers/storage';
import { availablePlatforms, buildMessages, getMapFromGameMode } from 'helpers/common';
import {
  LobbySteps,
  User,
  UserBetHistoryType,
  UserPlayerTag,
} from 'helpers/pl-types';
import {
  createTeamMutation,
  disbandTeamMutation,
  placeTeamBet,
} from 'api/gql/mutations';
import getUserTeams from 'api/gql/queries/get-user-teams';
import { disbandUserTeam } from 'api/gql/mutations/disband-team';
import getUserByGamerTag from 'api/gql/queries/get-user-list';
import getFeatureFlags from 'api/gql/queries/get-feature-flags';
import { RootState } from '../root-reducer';

export const userToUserPlayerTag = (currentUser: any): Array<any> => {
  const users: any = [];
  const user: any = { userId: currentUser.id, user: currentUser };
  availablePlatforms.forEach((platform: string) => {
    if (currentUser[`${platform.toLowerCase()}PlatformUsername`]) {
      users.push({
        ...user,
        platform: platform.toUpperCase(),
        playerTag: currentUser[`${platform.toLowerCase()}PlatformUsername`],
      });
    }
  });
  return users;
};

export const loadStep = createAsyncThunk(
  'lobby/loadStep',
  async ({ apollo }: any, { getState }) => {
    let lobby: any = {};
    let betStatus: any;
    const { lobby: currentLobby } = getState() as RootState;
    try {
      const { teamId } = currentLobby;
      if (teamId) {
        const resp = await apollo.query({
          query: getTeam,
          variables: { teamId },
        });
        lobby = resp.data?.getTeams[0];
      }
    } catch (err: any) {
      // TODO log a real error here
      // eslint-disable-next-line no-console
      console.error(err);
    }

    return { lobby, betStatus } as any;
  },
);

export const getAvailablePlayer = createAsyncThunk(
  'lobby/getAvailablePlayer',
  async ({ apollo, search }: any, { rejectWithValue, getState }) => {
    try {
      const { data, error } = await apollo.query({
        query: getUserByGamerTag,
        variables: { gamerTag: search },
      });
      if (error) {
        return rejectWithValue(buildMessages([error], 'error'));
      }

      const userList: User[] = data?.getByGamerTag || [];

      const { session } = getState() as RootState;
      const playerList = (userList.reduce((acc: any, curr: User) => {
        if (curr.id === session.currentUser.id) return acc;
        const users = userToUserPlayerTag(curr);
        return [...acc, ...users];
      }, []) as UserPlayerTag[]).sort((a: UserPlayerTag, b: UserPlayerTag) =>
        a.playerTag.toLowerCase() < b.playerTag.toLowerCase() ? -1 : 1,
      );

      return { playerList };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const getPlayerByTag = createAsyncThunk(
  'lobby/getPlayerByTag',
  async ({ apollo, search }: any, { rejectWithValue }) => {
    try {
      const { data, error } = await apollo.query({
        query: getUserByGamerTag,
        variables: { gamerTag: search },
      });
      if (error) {
        return rejectWithValue(buildMessages([error], 'error'));
      }

      const userList: User[] = data?.getByGamerTag || [];
      const playerList = (userList.reduce((acc: any, curr: User) => {
        const users = userToUserPlayerTag(curr);
        return [...acc, ...users];
      }, []) as UserPlayerTag[]).sort((a: UserPlayerTag, b: UserPlayerTag) =>
        a.playerTag.toLowerCase() < b.playerTag.toLowerCase() ? -1 : 1,
      );

      return { playerList };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const loadFeatureFlags = createAsyncThunk(
  'lobby/loadFeatureFlags',
  async ({ apollo }: any, { rejectWithValue }) => {
    try {
      const { data, error } = await apollo.query({
        query: getFeatureFlags,
        variables: { flag: 'stop_bets' },
      });
      if (error) {
        return rejectWithValue(buildMessages([error], 'error'));
      }

      const featureFlags = data.getFeatureByDomain.reduce(
        (total: any, ff: any) => {
          // eslint-disable-next-line no-param-reassign
          total[ff.domain] = ff.value === 'true';
          return total;
        },
        {},
      );
      return { featureFlags };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const createTeam = createAsyncThunk(
  'lobby/createTeam',
  async (
    { apollo, teamUsers, gameMode, pickedCategory, squadSize }: any,
    { rejectWithValue },
  ) => {
    try {
      const teammates = teamUsers.filter((x: UserPlayerTag) => x);
      if (!teammates.length) {
        return rejectWithValue(
          buildMessages(
            ['You need at least one member on your team.'],
            'error',
          ),
        );
      }
      if (teammates.every((x: UserPlayerTag) => x.userId)) {
        const team = await apollo.mutate({
          mutation: createTeamMutation,
          variables: {
            input: {
              users: teammates.map((tu: UserPlayerTag) => ({
                userId: tu.userId,
                lobbyPlatform: tu.platform,
              })),
              matchMap: getMapFromGameMode(gameMode),
              betCategory: pickedCategory,
              squadSize,
            },
          },
        });

        if (team.data.createTeam.errors.length) {
          return rejectWithValue(
            buildMessages(
              team.data.createTeam.errors.map((x: any) => x.message),
              'error',
            ),
          );
        }

        let text = '';
        const { result } = team.data.createTeam;
        if (result) {
          const privateUsers =
            result.privateUsers?.map((x: any) => x.usernamePlatform) || [];

          text = privateUsers.length
            ? ` Users with private profile: ${privateUsers.join()}.`
            : '';
        }

        const alerts = teammates.length > 1 ? buildMessages(
          [`Team updated!${text}`],
          'success',
        ) : {};

        // storage.save(TEAM_ID, team.data.createTeam.result.id);
        return {
          step: LobbySteps.tasks,
          lobby: result,
          alerts,
        };
      }
      return rejectWithValue(buildMessages([], 'error'));
    } catch (err: any) {
      return rejectWithValue(buildMessages([], 'error'));
    }
  },
);

export const submitBet = createAsyncThunk(
  'lobby/submitBet',
  async ({ apollo }: any, { rejectWithValue, getState }) => {
    try {
      const { lobby, session } = getState() as RootState;
      const betsPlaced = Object.entries(lobby.pickedBets).reduce(
        (acc: any, [bet, vals]: any) => {
          if (!vals.checked) return acc;
          const placedBet: any = {
            type: bet === 'killsPrizes' ? 'KILLS' : bet.toUpperCase(),
            level:
              bet === 'killsPrizes' ? lobby.pickedBets.main.level : vals.level,
          };
          return [...acc, placedBet];
        },
        [],
      );

      if (!betsPlaced.length)
        return rejectWithValue(
          buildMessages(['Please select a valid bet'], 'error'),
        );

      const variables = {
        input: {
          teamId: lobby.teamId,
          map: getMapFromGameMode(lobby.gameMode),
          betFormat: lobby.pickedCategory.toUpperCase(),
          userBetsLevelResult: betsPlaced,
        },
      };

      const response = await apollo.mutate({
        mutation: placeTeamBet,
        variables,
      });
      const responseData = response.data.placeTeamBet;

      if (responseData.errors?.length) {
        return rejectWithValue(
          buildMessages(
            responseData.errors.map((m: any) => m.message),
            'error',
          ),
        );
      }
      storage.save(LAST_BET_TIME, Date.now().toString());
      const currentUser = responseData.result.team.teammates.find((us: any) => us?.user?.id === session.currentUser?.id);
      return {
        betStatus: responseData.result.status,
        betHistory: responseData.result,
        newBalance: currentUser?.user?.wallet?.funds || 0,
      };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const getBetHistory = createAsyncThunk(
  'lobby/getBetHistory',
  async ({ apollo }: any, { rejectWithValue, getState }) => {
    try {
      const { session } = getState() as RootState;
      const resp = await apollo.query({
        query: getUserBetHistory,
        variables: {
          ownerId: session.currentUser.id,
        },
      });
      let betHistory: any = [];

      resp.data.listUsers.results[0].teams.forEach((t: any) => {
        const ids = betHistory.map((x: any) => x.id);
        betHistory = [
          ...betHistory,
          ...t.team.betHistory.filter((bh: any) => !ids.includes(bh.id)),
        ];
      });

      betHistory.sort((a: UserBetHistoryType, b: UserBetHistoryType) => {
        const adate = new Date(a.insertedAt);
        const bdate = new Date(b.insertedAt);
        if (adate > bdate) {
          return -1;
        }
        return 1;
      });

      return { betHistory, currentUserId: session.currentUser.id };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const getTeams = createAsyncThunk(
  'lobby/getTeams',
  async ({ apollo, currentUser }: any, { rejectWithValue, getState }) => {
    try {
      let lobby: any = {};
      const pickedBets: any = null;
      let betStatus: any;
      const pickedCategory = 'rookie';
      const { session } = getState() as RootState;
      const resp = await apollo.query({
        query: getUserTeams,
        variables: {
          listUsersFilter: {
            id: {
              eq: session.currentUser.id,
            },
          },
          teamsSort: { field: 'INSERTED_AT', order: 'DESC' },
        },
      });
      if (resp.data.listUsers.results[0].teams.team) {
        lobby = resp.data.listUsers.results[0].teams.team.bets;
      }

      return {
        ...resp.data,
        currentUser,
        lobby,
        pickedBets,
        betStatus,
        pickedCategory,
      };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const disbandTeam = createAsyncThunk(
  'lobby/disbandTeam',
  async (
    { apollo, withoutTeam, showAlert }: any,
    { rejectWithValue, getState },
  ) => {
    try {
      const { lobby, session } = getState() as RootState;
      let resp: any;
      if (!withoutTeam) {
        const teamId = storage.get(TEAM_ID);
        resp = await apollo.query({
          query: disbandTeamMutation,
          variables: {
            disbandTeamId: lobby.teamId || teamId,
          },
        });
      } else {
        resp = await apollo.query({
          query: disbandUserTeam,
          variables: {
            disbandUserId: session.currentUser.id,
          },
        });
      }

      if (resp.errors?.length) {
        return rejectWithValue(
          buildMessages(
            resp.errors.map((m: any) => m.message),
            'error',
          ),
        );
      }

      let alerts = null;
      if (showAlert) {
        alerts = buildMessages(['Team disbanded!'], 'success');
      }

      storage.remove(TEAM_ID);
      return { step: LobbySteps.players, alerts };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const disbandTeamToLobby = createAsyncThunk(
  'lobby/disbandTeam',
  async (
    { apollo, withoutTeam, showAlert }: any,
    { rejectWithValue, getState },
  ) => {
    try {
      const { lobby, session } = getState() as RootState;
      let resp: any;
      if (!withoutTeam) {
        const teamId = storage.get(TEAM_ID);
        resp = await apollo.query({
          query: disbandTeamMutation,
          variables: {
            disbandTeamId: lobby.teamId || teamId,
          },
        });
      } else {
        resp = await apollo.query({
          query: disbandUserTeam,
          variables: {
            disbandUserId: session.currentUser.id,
          },
        });
      }

      if (resp.errors?.length) {
        return rejectWithValue(
          buildMessages(
            resp.errors.map((m: any) => m.message),
            'error',
          ),
        );
      }

      let alerts = null;
      if (showAlert) {
        alerts = buildMessages(['Team disbanded!'], 'success');
      }
      return { step: LobbySteps.players, alerts };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);
