/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-unescaped-entities */
import { createStyles, makeStyles } from '@material-ui/core';
import styled from 'styled-components';
import SVG from 'assets/images/svgs'
import { fontMedium, fontSmall, fontMediumLarge } from 'styles/typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useApolloClient } from '@apollo/client';
import { FunctionComponent, ReactElement, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Channel } from 'phoenix';
import joinDiscordImg from 'assets/images/joindiscord.png';
import inviteImg from 'assets/images/invitebanner.png';
import useChannels from 'hooks/use-channels';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { createTeam, disbandTeam } from 'redux/actions/lobby-actions';
import Pill from 'components/core/pill';
import { GameModes, UserPlayerTag } from 'helpers/pl-types';
import { findMe, getUserPlatform, handleInviteFriend } from 'helpers/common';
import { AddplayerItem, PlayerItem } from './player-item';
import { AddPlayersModal } from './add-player-modal';

const BackIcon = styled(SVG)`
  fill: ${({ theme }) => theme.dark.icon.primary};
  height: 20px;
`;

const BackButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  height: 20px;
  padding: 0;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0 0 0 8px;
  ${fontMedium};
  font-weight: 900;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LeaveTeamButton = styled.button`
  background-color: transparent;
  border: 1px solid #2F9BD8;
  color: #2F9BD8;
  padding: 0 16px;
  height: 24px;
  border-radius: 24px;
  ${fontSmall};
  font-family: 'Lato';
`;

const MembersAmount = styled.span`
  ${fontSmall};
  margin: 4px 0 0 8px;
`;

const LookingForGroup = styled.h2`
  ${fontMediumLarge};
  margin-left: 16px;
`;

const useStyles = makeStyles((theme) =>
  createStyles({
    _dialogRoot: {
      maxHeight: 'none',
      position: 'absolute',
      top: '0rem',
      margin: 0,
      height: '100%',
      borderRadius: 0,
      width: '100%',
      backgroundColor: '#031725',
      // @ts-ignore
      zIndex: '2 !important',
    },
    contentStyles: ({ isKeyboardOpen, playerListLength }: any) => ({
      padding: '0 !important',
      backgroundColor: '#031725',
      display: 'flex',
      justifyContent:
        isKeyboardOpen && playerListLength ? 'flex-end' : 'flex-start',
      flexDirection: 'column',
    }),
    title: {
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      padding: '1rem 1rem 0.5rem 1.5rem',
      '& h2': {
        margin: '0',
        fontSize: '22px',
      },
      '& span': {
        fontSize: '11px',
        position: 'relative',
        left: '0.4rem',
        top: '3px',
      },
    },
    footer: {
      height: 144,
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
    },
    searchInput: {
      backgroundColor: '#eaf0f5',
      borderRadius: 24,
      width: '100%',
      '& input': {
        color: theme.palette.primary.main,
        padding: '1rem 24px 1rem 0',
      },
      '& ::after, ::before': {
        display: 'none',
      },
      '& .MuiInputBase-root': {
        margin: '0 !important',
      },
      '& .MuiInputLabel-shrink': {
        display: 'none',
      },
    },
    searchIcon: {
      color: '#3F7193',
      marginLeft: '1rem',
    },
    actionSection: {
      maxWidth: '600px',
      position: 'fixed',
      bottom: '4.2rem',
      width: '100%',
      padding: '0 1rem',
    },
    notFoundText: {
      color: 'gray',
      fontSize: '20px',
      alignSelf: 'center',
      marginTop: '5rem',
      padding: '0 2rem',
      textAlign: 'center',
    },
    banners: {
      display: 'flex',
      padding: '0.4rem 3%',
      '& .invite': {
        maxWidth: '47%',
        margin: '0 2%',
      },
    },
  }),
);

const AvailablePlayersModal: FunctionComponent<{
  teamChannel: Channel | null;
}> = ({ teamChannel }: any) => {
  const apollo = useApolloClient();
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const {
    openTeamModal,
    playerList,
    teamUsers,
    lobbySize,
    isCaptain,
    gameMode,
    pickedCategory,
    teamUsersBackup,
    restartSocket,
    squadSize,
  } = useSelector(({ lobby }: RootState) => lobby);
  const css = useStyles({ playerListLength: playerList.length });
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const userChannel = useChannels(`user`, currentUser?.id);
  const users = teamUsers.filter((tu: UserPlayerTag) => tu);

  const getTeammatesIds = (): Array<string> =>
    teamUsers?.map((us: UserPlayerTag) => us?.userId);
  const handleOpenAddPlayers = (): void => {
    if (!isCaptain) return;
    dispatch(setStoreProperty(['searchingPlayers', true]));
  };

  const handleUpdateTeam = async (): Promise<null | undefined> => {
    if (
      users.length === teamUsersBackup.length &&
      users.every((u) => teamUsersBackup.map((x) => x.userId).includes(u.userId))
    ) {
      dispatch(setStoreProperty(['openTeamModal', false]));
      return;
    }
    if (isCaptain) {
      teamChannel?.push('update', { event: 'disband' });
    }
    dispatch(setStoreProperty(['autoCreateSolo', 0]));
    const disbandAnswer: any = await dispatch(disbandTeam({ apollo, showAlert: false }));
    if (disbandAnswer.payload?.step === 1) {
      const newSquadSize = gameMode !== GameModes.Rebirth ? teamUsers.filter(x => x).length : squadSize;
      setTimeout(async () => {
        await dispatch(
          createTeam({
            apollo,
            teamUsers,
            isUpdatingTeam: true,
            gameMode,
            pickedCategory,
            squadSize: newSquadSize,
          }),
        );
      }, 1000);
      dispatch(setStoreProperty(['openTeamModal', false]));
      dispatch(setStoreProperty(['teamUsersBackup', []]));
    }
  };

  const disbandParty = async (): Promise<undefined | null> => {
    dispatch(setStoreProperty(['restartSocket', restartSocket + 1]));
    await dispatch(
      disbandTeam({ apollo, withoutTeam: isCaptain, showAlert: true }),
    );
    dispatch(setStoreProperty(['openTeamModal', false]));
    history.push('/team');
    if (isCaptain) {
      teamChannel?.push('update', { event: 'disband' });
      return;
    }
    userChannel?.push('invite', {
      event: 'leave',
      user_id: teamUsers[0].userId,
      user: findMe(teamUsers, currentUser),
    });
  };

  const handleRemoveTeammate = (user: any): null | undefined => {
    if (isCaptain) {
      const newTeamUsers = teamUsers.filter(
        (tu: UserPlayerTag) => tu && tu.userId !== user?.userId,
      );
      newTeamUsers.push(null);

      dispatch(
        setStoreProperty([
          'teamUsers',
          [
            ...newTeamUsers,
            ...new Array(lobbySize - newTeamUsers.length).fill(null),
          ],
        ]),
      );
      return;
    }
    userChannel?.push('invite', {
      event: 'leave',
      user_id: teamUsers[0].userId,
      user: findMe(teamUsers, currentUser),
    });
  };

  const handleAddRemoveUser = (added: boolean, user: any): void => {
    if (!isCaptain || user.userId === currentUser.id) return;
    if (added) handleRemoveTeammate(user);
  };

  const handleCloseModal = (): void => {
    dispatch(setStoreProperty(['teamUsers', teamUsersBackup]));
    dispatch(setStoreProperty(['openTeamModal', false]));
  }

  const redirectToDiscord = (): void => {
    window.open("https://discord.gg/yH3q44sNJz", "_blank");
  }

  const renderPlayers = (): Array<ReactElement> =>
    teamUsers
      .filter((u) => u)
      .map((u, i) => {
        const name = getUserPlatform(u.user).username;
        const idsSelected = getTeammatesIds();
        return (
          <PlayerItem
            key={`${u.platform}-${u.playerTag}`}
            name={name || u.playerTag}
            platform={u.platform}
            added={idsSelected?.includes(u.userId)}
            user={u}
            onClick={handleAddRemoveUser}
            isUpdate
            index={i}
          />
        );
      });

  useEffect(() => {
    if (openTeamModal) {
      dispatch(setStoreProperty(['teamUsersBackup', users]));
    }
  }, [openTeamModal]);

  return (
    <>
      <Dialog
        // @ts-ignore
        style={{ zIndex: '9 !important' }}
        open={openTeamModal}
        // eslint-disable-next-line no-underscore-dangle
        PaperProps={{ classes: { root: css._dialogRoot } }}
      >
        <DialogContent className={css.contentStyles}>
          <Heading>
            <TitleWrapper>
              <BackButton onClick={handleCloseModal}>
                <BackIcon icon="action:chevronLeft" />
              </BackButton>
              <TitleWrapper>
                <Title>Your team</Title>
                <MembersAmount>{users.length}/4</MembersAmount>
              </TitleWrapper>
            </TitleWrapper>
            <LeaveTeamButton onClick={disbandParty}>
              Leave team
            </LeaveTeamButton>
          </Heading>
          {renderPlayers()}
          {users.length !== 4 && (
            <AddplayerItem onClick={handleOpenAddPlayers} />
          )}

          <LookingForGroup>Looking for a group?</LookingForGroup>

          <div className={css.banners}>
            <img
              className="invite"
              src={joinDiscordImg}
              alt="Discord"
              onClick={redirectToDiscord}
            />
            <img
              className="invite"
              src={inviteImg}
              alt="Invite"
              onClick={() => handleInviteFriend(enqueueSnackbar)}
            />
          </div>
          {isCaptain && (
            <div className={css.actionSection}>
              <Pill variant="info" onClick={handleUpdateTeam}>
                Update
              </Pill>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AddPlayersModal />
    </>
  );
};

export default AvailablePlayersModal;
