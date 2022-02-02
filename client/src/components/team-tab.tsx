import { capitalize } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import { FunctionComponent } from 'react';
import { UserPlayerTag } from 'helpers/pl-types';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { useUserBoxStyles } from 'styles/index';

export const teamUsersColors = ['#5E2FD8', '#D82F4B', '#2F9BD8', '#23CA78'];

export const TeamTab: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { teamUsers, isCaptain, openTeamModal } = useSelector(
    ({ lobby }: RootState) => lobby,
  );
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const users = teamUsers.filter((tu: UserPlayerTag) => tu);
  const userboxStyles = useUserBoxStyles({
    isCaptain,
    usersLength: users.length,
    openTeamModal,
  });

  const handleClickTeam = (): void => {
    if (currentUser.privateProfile) return;
    dispatch(setStoreProperty(['openTeamModal', !openTeamModal]));
  };

  return (
    <div
      className={userboxStyles.userBoxRoot}
      onClick={handleClickTeam}
      onKeyPress={handleClickTeam}
      tabIndex={0}
      role="button"
    >
      {users.map(({ user, playerTag }, i) => (
        <div
          key={user.id}
          style={{
            zIndex: 10 - i,
            left: `${i * (users.length === 4 ? 18 : 20)}px`,
            backgroundColor: teamUsersColors[i],
          }}
          className={userboxStyles.userCircle}
        >
          <span className={userboxStyles.userLetter}>
            {playerTag ? capitalize(playerTag[0]) : 'A'}
          </span>
        </div>
      ))}
      {users.length === 1 && (
        <div
          style={{
            zIndex: 10,
            left: `20px`,
            backgroundColor: '#0C273A',
            width: '28px',
            height: '28px',
            top: '-5px',
            paddingBottom: '8px'
          }}
          className={userboxStyles.userCircle}
        >
          <span className={userboxStyles.userLetter}>
            <PersonAddOutlinedIcon />
          </span>
        </div>
      )}
    </div>
  );
};

export default TeamTab;
