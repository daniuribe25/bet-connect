import { FunctionComponent, useEffect, useRef, useState } from 'react';
/* eslint-disable react/no-unescaped-entities */
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
import { useSnackbar, SnackbarKey } from 'notistack';
import { useApolloClient } from '@apollo/client';
import { useDebounce } from '@react-hook/debounce';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { UserPlayerTag } from 'helpers/pl-types';
import { getAvailablePlayer } from 'redux/actions/lobby-actions';
import useChannels from 'hooks/use-channels';
import { findMe, getUserPlatform } from 'helpers/common';
import { trackSentTeamInvite } from 'helpers/segment-analytics';
import { declineInvitationReasons } from '../user-socket-handler';
import { RecentPlayers } from './recent-players';
import { PlayerItem } from './player-item';

const useStyles = makeStyles((theme) =>
  createStyles({
    _dialogRoot: ({ teamId }: any) => ({
      maxHeight: 'none',
      position: 'absolute',
      top: '0rem',
      margin: 0,
      height: '100%',
      borderRadius: 0,
      width: '100%',
      backgroundColor: '#fff',
      zIndex: !teamId ? 2 : 1302,
    }),
    contentStyles: ({ isKeyboardOpen, playerListLength }: any) => ({
      padding: '0 !important',
      backgroundColor: '#EAF0F5',
      display: 'flex',
      justifyContent:
        isKeyboardOpen && playerListLength ? 'flex-end' : 'flex-start',
      flexDirection: 'column',
    }),
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
    doneButton: {
      background: '#2F9BD8',
      borderRadius: '24px',
      maxWidth: '700px',
      padding: '10px 20px',
      width: '100%',
      textAlign: 'center',
      margin: '1rem 0 0 0',
      color: theme.palette.text.primary,
      fontSize: '15px',
    },
    notFoundText: {
      color: 'gray',
      fontSize: '20px',
      alignSelf: 'center',
      marginTop: '5rem',
      padding: '0 2rem',
      textAlign: 'center',
    },
  }),
);

export const showDeclineReason = (
  reason: number,
  enqueueSnackbar: any,
): string | void => {
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

export const AddPlayersModal: FunctionComponent = () => {
  const searchInputRef: any = useRef(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const apollo = useApolloClient();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {
    searchingPlayers,
    searchingPlayersValue,
    playerList,
    teamUsers,
    lobbySize,
    recentPlayers,
    teamId,
  } = useSelector(({ lobby }: RootState) => lobby);
  const css = useStyles({
    isKeyboardOpen,
    playerListLength: playerList.length,
    teamId,
  });
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const [filteredUsers, setFilteredUsers] = useState<UserPlayerTag[]>(
    playerList.filter((x) => x.userId !== currentUser?.userId),
  );
  const [isSearching, setIsSearching] = useState(true); // <-- Change this to FALSE when recent players are implemented on the backend
  const ref = useRef<HTMLInputElement>();
  const userChannel = useChannels(`user`, currentUser?.id);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useDebounce('', 1000);

  const onClose = (): void => {
    dispatch(setStoreProperty(['searchingPlayers', false]));
    dispatch(setStoreProperty(['searchingPlayersValue', '']));
    setFilteredUsers(playerList.filter((x) => x.userId !== currentUser.userId));
    dispatch(setStoreProperty(['searchingPlayers', false]));
    setIsSearching(true); // <-- Change this to FALSE when recent players are implemented on the backend
  };

  const getTeammatesIds = (): Array<string> =>
    teamUsers?.map((us: UserPlayerTag) => us?.userId);

  useEffect(() => {
    setSearchDebounced(search);
  }, [search]);

  useEffect(() => {
    dispatch(setStoreProperty(['searchingPlayersValue', searchDebounced]));
    if (searchDebounced.length > 2) {
      dispatch(getAvailablePlayer({ apollo, search: searchDebounced }));
    }
  }, [searchDebounced]);

  useEffect(
    () =>
      setFilteredUsers(
        playerList.filter((x) => x.userId !== currentUser.userId),
      ),
    [playerList],
  );

  const handleAddUser = (
    added: boolean,
    user: UserPlayerTag,
  ): number | null | SnackbarKey => {
    let newTeamUsers = [];
    if (!added) {
      const addedUsers = teamUsers.filter((tu: UserPlayerTag) => tu);
      if (addedUsers.length === lobbySize)
        return enqueueSnackbar('Lobby is full', { variant: 'error' });
      newTeamUsers = [...teamUsers];
      newTeamUsers[addedUsers.length] = { ...user, invitationStatus: 1 };
      trackSentTeamInvite(user.userId, teamId);
      /* userChannel
        ?.push('invite', {
          user_id: user.userId,
          event: 'invite',
          user: newTeamUsers[0],
          teamId
        })
        .receive('ok', (data: any) => {
          trackSentTeamInvite(user.userId, teamId);
          if (!data.push_sended) {
            newTeamUsers = [...teamUsers];
            newTeamUsers[addedUsers.length] = { ...user, invitationStatus: -1 };
            dispatch(setStoreProperty(['teamUsers', newTeamUsers]));
            showDeclineReason(data.info.reason, enqueueSnackbar);
          }
        }); */
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
    setFilteredUsers(playerList.filter((x) => x.userId !== currentUser.userId));
    dispatch(setStoreProperty(['teamUsers', newTeamUsers]));
    setSearch('');
    return null;
  };

  const renderPlayers: any = () => {
    return filteredUsers.map((u) => {
      if (!u) return null;
      const name = getUserPlatform(u.user).username;
      const idsSelected = getTeammatesIds();
      return (
        <PlayerItem
          key={`${u.platform}-${u.playerTag}`}
          name={name || u.playerTag}
          platform={u.platform}
          added={idsSelected?.includes(u.userId)}
          user={u}
          onClick={handleAddUser}
          isUpdate={false}
        />
      );
    });
  };

  return (
    <Dialog
      open={searchingPlayers}
      onClose={onClose}
      // eslint-disable-next-line no-underscore-dangle
      PaperProps={{ classes: { root: css._dialogRoot } }}
      onBackdropClick={onClose}
    >
      <DialogContent className={css.contentStyles}>
        <RecentPlayers closeModal={onClose} />
        {!playerList.length &&
          searchingPlayersValue &&
          !recentPlayers.length && (
            <span className={css.notFoundText}>
              We haven't found any players with that username
            </span>
          )}
        {!playerList.length &&
          !searchingPlayersValue &&
          !recentPlayers.length && (
            <span className={css.notFoundText}>
              Search for the players you want in your team
            </span>
          )}
        {isSearching && renderPlayers()}
      </DialogContent>

      <DialogActions classes={{ root: css.footer }}>
        <TextField
          className={css.searchInput}
          ref={searchInputRef}
          value={search}
          onFocus={() => setIsKeyboardOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsKeyboardOpen(false), 200);
            if (searchInputRef?.current?.focus)
              searchInputRef?.current?.focus();
          }}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          label="Search Gamertags"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className={css.searchIcon}>
                <SearchIcon />
              </InputAdornment>
            ),
            ref,
          }}
        />
        <Button
          className={css.doneButton}
          variant="contained"
          onClick={onClose}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
