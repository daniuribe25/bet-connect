import { FunctionComponent, useState } from 'react';
import { capitalize, MenuItem, Menu } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import { useHistory } from 'react-router-dom';
import { UserPlayerTag } from 'helpers/pl-types';
import { RootState } from 'redux/root-reducer';
import { getBetAnte, getMapFromGameMode } from 'helpers/common';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { InvitationStatus } from 'views/team/components/lobby-seat';
import { useUserBoxStyles } from 'styles/index';

const colors = ['#5E2FD8', '#D82F4B', '#2F9BD8', '#23CA78'];

export const UserBox: FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { teamUsers, pickedCategory, isCaptain, gameMode } = useSelector(
    ({ lobby }: RootState) => lobby,
  );
  const styles = useUserBoxStyles({ isCaptain });
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const users = teamUsers.filter((tu: UserPlayerTag) => tu);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e: any): void => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };
  const handleUpdateTeam = (): void => {
    if (!isCaptain) return;
    dispatch(setStoreProperty(['isUpdatingTeam', true]));
    dispatch(
      setStoreProperty(['teamUsersBackup', users]),
    );
    const newTeamUsers = [...teamUsers].map((x) => {
      if (!x || x.userId === currentUser.id) return x;
      return { ...x, invitationStatus: InvitationStatus.joined };
    });
    dispatch(setStoreProperty(['teamUsers', newTeamUsers]));
    history.push('/team');
  };

  return (
    <div className={styles.usersCont}>
      {isCaptain && (
        <div
          className={styles.updateIcon}
          onClick={handleUpdateTeam}
          onKeyPress={handleUpdateTeam}
          tabIndex={0}
          role="button"
        >
          <CreateOutlinedIcon />
        </div>
      )}
      <div className={styles.mainBetCont}>
        <span className={styles.mainBetText}>
          ${getBetAnte(pickedCategory, true)} main bet
        </span>
        {
          <span className={styles.gamemodeText}>
            {getMapFromGameMode(gameMode).replace('_', ' ').toLocaleLowerCase()}
          </span>
        }
      </div>
      <div
        className={styles.userBoxRoot}
        onClick={handleClick}
        onKeyPress={handleClick}
        tabIndex={0}
        role="button"
      >
        {users.map(({ user, playerTag }, i) => (
          <div
            key={user.id}
            style={{
              zIndex: 10 - i,
              left: `${i * (users.length === 4 ? 18 : 20)}px`,
              borderColor: colors[i],
            }}
            className={styles.userCircle}
          >
            <span className={styles.userLetter} style={{ color: colors[i] }}>
              {capitalize(playerTag[0])}
            </span>
          </div>
        ))}
      </div>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
        style={{ minWidth: '400px' }}
      >
        {users.map(({ user, playerTag }: any) => (
          <MenuItem
            key={user.id}
            onClick={() => handleClose()}
            style={{ minHeight: '20px' }}
          >
            <div
              style={{
                display: 'flex',
                minWidth: '260px',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '12px' }}>{playerTag}</span>
              <div style={{ display: 'flex' }}>
                <AccountBalanceWalletIcon fontSize="small" />
                <span style={{ fontSize: '12px' }}>
                  {user?.wallet?.funds?.toFixed(2)}
                </span>
              </div>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default UserBox;
