import { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { findMe } from 'helpers/common';
import storage, { AUTH_TOKEN, TEAM_ID } from 'helpers/storage';
import useChannels from 'hooks/use-channels';
import { RootState } from 'redux/root-reducer';
import { logout, logout as logoutLobby } from 'redux/slices/session-slice';

// TODO HANDLE THE ERROR!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorFallback: FunctionComponent = ({ error }: any) => {
  const { isCaptain, teamUsers } = useSelector(({ lobby }: RootState) => lobby);
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const userChannel = useChannels(`user`, currentUser?.id);

  const disbandLobby = (): void => {
    if (isCaptain) {
      teamUsers
        .filter((u) => u)
        .forEach((user) => {
          userChannel?.push('invite', {
            event: 'kick',
            user_id: user.userId,
            user: findMe(teamUsers, currentUser),
          });
        });
    }
  };

  useEffect(() => {
    storage.remove(TEAM_ID);
    disbandLobby();
    storage.remove(AUTH_TOKEN);
    storage.remove(TEAM_ID);
    dispatch(logout());
    dispatch(logoutLobby());
    history.push('/login');
  }, []);

  return <div>Daniel</div>;
};

export default ErrorFallback;
