/* eslint-disable no-case-declarations */
import { useApolloClient } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { findMe } from 'helpers/common';
import { UserPlayerTag } from 'helpers/pl-types';
import { trackJoinedTeam } from 'helpers/segment-analytics';
import useChannels from 'hooks/use-channels';
import {
  disbandTeamToLobby,
  getPlayerByTag,
  getTeams,
  loadFeatureFlags,
} from 'redux/actions/lobby-actions';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { InvitationStatus } from 'views/team/components/lobby-seat';
// import { InviteModal } from "./InviteModal";

export const declineInvitationReasons = {
  decline: 1,
  inTeam: 2,
  waitingResponse: 3,
  playerDidntRespond: 4,
};

export const UserSocketHandler = (): null => {
  const dispatch = useDispatch();
  const apollo = useApolloClient();
  const {
    teamUsers,
    restartSocket,
    gameMode,
    pickedCategory,
    isCaptain,
    teamId,
    userInvitation: userInvite,
    lobbySize,
    updateWallet,
  } = useSelector(({ lobby }: RootState) => lobby);
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const userChannel = useChannels(`user`, currentUser?.id);
  const lobbyChannel = useChannels(`feature`, `lobby`);
  const [userInvitation, setUserInvitation] = useState<any>();
  const [userTeam, setUserTeam] = useState<any>();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const showDeclineReason = (reason: number): string | void => {
    let message = '';
    // eslint-disable-next-line default-case
    switch (reason) {
      case declineInvitationReasons.decline:
        message = 'Player has declined your invitation';
        break;
      case declineInvitationReasons.inTeam:
        message = 'Player is already in a team';
        break;
      case declineInvitationReasons.waitingResponse:
        message = 'Player has been invited by another user';
        break;
      case declineInvitationReasons.playerDidntRespond:
        message = 'Player didn´t respond the invitation';
        break;
    }
    enqueueSnackbar(message, { variant: 'error' });
  };

  const updateTeam = (): void => {
    if (currentUser && teamUsers) {
      teamUsers
        .filter((u) => u && u?.userId !== currentUser.id)
        .forEach((user) => {
          userChannel?.push('invite', {
            event: 'update',
            user_id: user.userId,
            user: findMe(teamUsers, currentUser),
            teamUsers,
            gameMode,
            pickedCategory,
            metadata: { teamUsers, gameMode, pickedCategory },
          });
        });
      }
  };

  const updatingTeam = (): void => {
    teamUsers
      .filter((u) => u && u?.userId !== currentUser.id)
      .forEach((user) => {
        userChannel?.push('invite', {
          event: 'updatingTeam',
          user_id: user.userId,
          user: findMe(teamUsers, currentUser),
        });
      });
  };

  // const acceptInvitation = (user: UserPlayerTag): void => {
  //   // dispatch(setStoreProperty(['isCaptain', false]));
  //   // dispatch(setStoreProperty(['lobbyId', '123']));
  //   // dispatch(setStoreProperty(['teamId', newTeamId]));
  //   // setUserTeam(user);
  //   userChannel?.push('invite', {
  //     event: 'join',
  //     user_id: user.userId,
  //     user: findMe(teamUsers, currentUser),
  //   });
  //   dispatch(setStoreProperty(['searchingPlayers', false]));
  // };

  const resetState = (): void => {
    const user = findMe(teamUsers, currentUser);
    if (user) {
      const u = { ...user, invitationStatus: undefined };
      dispatch(setStoreProperty(['teamUsers', [u, null, null, null]]));
    }
    dispatch(setStoreProperty(['isCaptain', true]));
    dispatch(setStoreProperty(['teamId', null]));
    dispatch(setStoreProperty(['lobbyId', null]));
    dispatch(setStoreProperty(['autoCreateSolo', 1]));
    setUserTeam(null);
    setUserInvitation(null);
  };

  useEffect(() => {
    if (userInvite) setUserInvitation(userInvite);
  }, [userInvite]);

  useEffect(() => {
    if (isCaptain) updateTeam();
  }, [pickedCategory, gameMode, teamUsers]);

  useEffect(() => {
    resetState();
  }, [restartSocket]);

  useEffect(() => {
    userChannel?.off('invite');
    userChannel?.off('update');
    userChannel?.off('new_team');
    userChannel?.off('bet_lines');
    userChannel?.on('invite', (data: any) => {
      // eslint-disable-next-line default-case
      switch (data?.event) {
        case 'invite':
          // if (userInvitation) return declineInvitation(data.user, declineInvitationReasons.waitingResponse);
          // if (teamId || teamUsers.filter(user => user).length > 1) return declineInvitation(data.user, declineInvitationReasons.inTeam);

          // acceptInvitation(data.user);
          // setUserInvitation(null);
          trackJoinedTeam(currentUser.id, teamId);
          break;
        case 'decline':
        case 'join':
          const newTeam = [...teamUsers];
          const i = newTeam.findIndex((u) => u?.userId === data.user?.userId);

          const status = data.event === 'join' ? 1 : -1;
          newTeam[i] = { ...newTeam[i], invitationStatus: status };
          dispatch(setStoreProperty(['teamUsers', newTeam]));
          if (data.event === 'decline') showDeclineReason(data.reason);
          if (!userTeam) setUserTeam(findMe(newTeam, currentUser));
          break;

        case 'updateMe':
          if (isCaptain) updateTeam();
          break;

        case 'update':
          if (
            !isCaptain &&
            (data.user?.userId === teamUsers[0].userId ||
              data.user?.userId === userTeam?.userId)
          ) {
            dispatch(setStoreProperty(['teamUsers', data.teamUsers]));
            dispatch(setStoreProperty(['gameMode', data.gameMode]));
            dispatch(setStoreProperty(['pickedCategory', data.pickedCategory]));
          }
          break;
        case 'kick':
          if (!isCaptain) {
            if (data.user?.userId === teamUsers[0].userId) {
              resetState();
              history.push('/team');
              if (data.reason === 'disband')
                enqueueSnackbar(`Team disbanded by the captain`, {
                  variant: 'error',
                });
            }
          } else if (data.user?.userId === userInvitation?.userId) {
            setUserInvitation(null);
          }
          break;
        case 'disband':
          enqueueSnackbar(`Team disbanded by the captain`, {
            variant: 'error',
          });
          resetState();
          history.push('/team');
          break;
        case 'updatingTeam':
          history.push('/team');
          break;
        case 'leave':
          // eslint-disable-next-line no-case-declarations
          let newTeamUsers = teamUsers.filter(
            (tu: UserPlayerTag) => tu && tu.userId !== data.user?.userId,
          );
          newTeamUsers = newTeamUsers.map((x) => {
            if (!x || x.userId === currentUser.id) return x;
            return { ...x, invitationStatus: InvitationStatus.joined };
          });
          dispatch(
            setStoreProperty([
              'teamUsers',
              [
                ...newTeamUsers,
                ...new Array(lobbySize - newTeamUsers.length).fill(null),
              ],
            ]),
          );
          enqueueSnackbar(`${data.user.playerTag} has left the team`, {
            variant: 'error',
          });
          userChannel?.push('invite', {
            event: 'kick',
            user_id: data.user.userId,
            user: findMe(teamUsers, currentUser),
          });
          if (teamId) {
            dispatch(setStoreProperty(['isUpdatingTeam', true]));
            dispatch(disbandTeamToLobby({ apollo, showAlert: false }));
          }
          history.push('/team');
          updatingTeam();
          break;
        default:
          console.log(data);
      }
    });
    userChannel?.on('new_team', (data: any) => {
      setTimeout(async () => {
        if (data?.team_id) {
          await dispatch(setStoreProperty(['teamId', data.team_id]));
        }
        await dispatch(getTeams({ apollo, currentUser }));
        // await dispatch(loadStep({ apollo }));
        if (isCaptain) history.push('/bet');
        if (!isCaptain) history.push('/activeBet');
      }, 2000);
    });
    userChannel?.on('bet_lines', () => {
      dispatch(getTeams({ apollo, currentUser }));
    });
  }, [
    userChannel,
    teamUsers,
    isCaptain,
    userInvitation,
    userTeam,
    teamId,
    history,
  ]);

  // const handleInviteResponse = (accepts: boolean) => {

  //   if (!accepts) {
  //     setUserInvitation(null);
  //     declineInvitation(userInvitation, declineInvitationReasons.decline);
  //     return;
  //   }
  //   acceptInvitation(userInvitation);
  //   setUserInvitation(null);
  // };

  // const declineInvitation = (user: UserPlayerTag, reason = declineInvitationReasons.decline) => {
  //   userChannel?.push('invite', { event: 'decline', user_id: user.userId, reason, user: findMe(teamUsers, currentUser) });
  // }

  const updateUsersWallets = async (): Promise<void> => {
    try {
      if (isCaptain && teamUsers.filter((u) => u).length > 0) {
        const newTeam: Array<UserPlayerTag | null> = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const u of teamUsers) {
          if (u) {
            // TODO don't await within a loop
            // eslint-disable-next-line no-await-in-loop
            const playerList: any = await dispatch(
              getPlayerByTag({ apollo, search: u.playerTag }),
            );
            const user: UserPlayerTag = playerList.payload.playerList.find(
              (us: UserPlayerTag) => us.userId === u.userId,
            );
            newTeam.push({ ...user, invitationStatus: u.invitationStatus });
          } else {
            newTeam.push(null);
          }
        }
        dispatch(
          setStoreProperty([
            'teamUsers',
            [...newTeam, ...new Array(lobbySize - newTeam.length).fill(null)],
          ]),
        );
      }
    } catch (error) {
      // Todo throw real error
      // eslint-disable-next-line no-console
      console.error('Error fetching users', error);
    }
  };

  useEffect(() => {
    updateUsersWallets();
  }, [updateWallet]);

  useEffect(() => {
    lobbyChannel?.off('event');
    lobbyChannel?.on('event', () => {
      dispatch(loadFeatureFlags({ apollo }));
    });
  }, [lobbyChannel]);

  return null;
  // return (
  //   <>
  //     {userInvitation && <InviteModal user={userInvitation} onClick={handleInviteResponse} />}
  //   </>
  // )
};

export default UserSocketHandler;
