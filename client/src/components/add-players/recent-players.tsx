import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import { fontMedium } from 'styles/typography';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar, SnackbarKey } from 'notistack';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { UserPlayerTag } from 'helpers/pl-types';
import { userToUserPlayerTag } from 'redux/actions/lobby-actions';
import useChannels from 'hooks/use-channels';
import { findMe, getUserPlatform } from 'helpers/common';
import { PlayerItem } from './player-item';

type RecentPlayersType = {
  closeModal: () => void;
}

const CloseIcon = styled(SVG)`
  fill: ${({ theme }) => theme.light.icon.secondary};
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px 16px 16px;
  justify-content: space-between;
`;

const Title = styled.h3`
  ${fontMedium};
  font-weight: 900;
  color: ${({ theme }) => theme.light.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
`;

export const RecentPlayers: React.FC<RecentPlayersType> = (props) => {
  const { closeModal } = props;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { teamUsers, lobbySize, userBetHistory } = useSelector(
    ({ lobby }: RootState) => lobby,
  );
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const userChannel = useChannels(`user`, currentUser?.id);

  const handleAddUser = (
    added: boolean,
    user: UserPlayerTag,
  ): SnackbarKey | null => {
    let newTeamUsers = [];
    if (!added) {
      const addedUsers = teamUsers.filter((tu: UserPlayerTag) => tu);
      if (addedUsers.length === lobbySize)
        return enqueueSnackbar('Lobby is full', { variant: 'error' });
      newTeamUsers = [...teamUsers];
      newTeamUsers[addedUsers.length] = { ...user, invitationStatus: 0 };
      // userChannel
      //   ?.push('invite', {
      //     user_id: user.userId,
      //     event: 'invite',
      //     user: newTeamUsers[0],
      //   })
      //   .receive('ok', (data: any) => {
      //     trackSentTeamInvite(user.userId, teamId);
      //     if (!data.push_sended) {
      //       newTeamUsers = [...teamUsers];
      //       newTeamUsers[addedUsers.length] = { ...user, invitationStatus: -1 };
      //       dispatch(setStoreProperty(['teamUsers', newTeamUsers]));
      //       showDeclineReason(data.info.reason, enqueueSnackbar);
      //     }
      //   });
    } else {
      newTeamUsers = teamUsers.filter((u) => u?.userId !== user.userId);
      newTeamUsers.push(null);
      userChannel?.push('invite', {
        event: 'kick',
        user_id: user.userId,
        user: findMe(teamUsers, currentUser),
      });
    }
    dispatch(setStoreProperty(['searchingPlayersValue', '']));
    dispatch(setStoreProperty(['teamUsers', newTeamUsers]));
    return null;
  };

  const recentPlayersList = useMemo(() => {
    let recentPlayers: any = [];
    const size = 5;
    let i = 0;
    while (recentPlayers.length < size) {
      if (!userBetHistory[i]) break;
      const recentPlayerIds = recentPlayers.map((x: any) => x.userId);
      if (userBetHistory[i]) {
        const newPlayers = userBetHistory[i].team.teammates.filter(
          (x: any) =>
            x?.user?.id !== currentUser.id &&
            !recentPlayerIds.includes(x?.user?.id),
        );
        const newPlayersFormatted = newPlayers.reduce((acc: any, curr: any) => {
          const users = userToUserPlayerTag(curr.user);
          return [...acc, ...users];
        }, []);
        recentPlayers = [...recentPlayers, ...newPlayersFormatted];
      }
      i += 1;
    }
    dispatch(setStoreProperty(['recentPlayers', recentPlayers]));
    return recentPlayers;
  }, [userBetHistory.length]);

  const getTeammatesIds = (): Array<string> =>
    teamUsers.map((us: UserPlayerTag) => us?.userId);

  const RenderPlayers: FunctionComponent = () =>
    recentPlayersList.map((u: any) => {
      if (!u) return null;
      const name = getUserPlatform(u.user).username;
      const idsSelected = getTeammatesIds();
      return (
        <PlayerItem
          key={`${u.platform}-${u.playerTag}`}
          name={name || u.playerTag}
          platform={u.platform}
          added={idsSelected.includes(u.userId)}
          user={u}
          onClick={handleAddUser}
          isUpdate={false}
        />
      );
    });

  return (
    recentPlayersList.length && (
      <div>
        <TitleWrapper>
          <Title>Recent players</Title>
          <CloseButton onClick={closeModal}>
            <CloseIcon icon="action:close" />
          </CloseButton>
        </TitleWrapper>
        <RenderPlayers />
      </div>
    )
  );
};

export default RecentPlayers;
