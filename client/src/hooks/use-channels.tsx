/* eslint-disable no-restricted-syntax */
import { Channel } from 'phoenix';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SocketContext from '../providers/socket-context';
import { RootState } from '../redux/root-reducer';
import { setStoreProperty } from '../redux/slices/lobby-slice';

const useChannels = (
  channelName: string | null,
  param: string | null,
): Channel | null => {
  let context = useContext(SocketContext);
  const [channel, setChannel] = useState<Channel | null>(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const { teamId, lobbySize } = useSelector(({ lobby }: RootState) => lobby);
  context = context || {};
  const { socket, channels, setChannels, socketConnected } = context;

  useEffect(() => {
    if (socket && socketConnected && socket.isConnected()) {
      if (!channelName || !param) return () => null;
      const name = `${channelName}:${param}`;
      if (channels[name]) {
        setChannel(channels[name]);
      } else {
        const c = socket.channel(name);
        c.join()
          .receive('ok', (data: any) => {
            if (data?.lobby?.metadata?.teamUsers) {
              dispatch(setStoreProperty(['lobbyId', data.lobby.id]));
              setTimeout(() => {
                for (const u of data.lobby.users) {
                  if (u.user_id === currentUser.id && u.status === 'pending')
                    return dispatch(
                      setStoreProperty([
                        'userInvitation',
                        data.lobby.metadata.teamUsers[0],
                      ]),
                    );
                }
                if (!teamId) {
                  dispatch(
                    setStoreProperty([
                      'isCaptain',
                      data.lobby.leader_id === currentUser.id,
                    ]),
                  );
                  dispatch(
                    setStoreProperty([
                      'teamUsers',
                      [
                        ...data.lobby.metadata.teamUsers,
                        ...new Array(
                          lobbySize - data.lobby.metadata.teamUsers.length,
                        ).fill(null),
                      ],
                    ]),
                  );
                  dispatch(
                    setStoreProperty([
                      'gameMode',
                      data.lobby.metadata.gameMode,
                    ]),
                  );
                  dispatch(
                    setStoreProperty([
                      'pickedCategory',
                      data.lobby.metadata.pickedCategory,
                    ]),
                  );
                }
                return null;
              }, 1000);
            }
          })
          .receive('error', (reasons: any) =>
            // TODO log real error
            // eslint-disable-next-line no-console
            console.log('create failed', reasons, name),
          );
        channels[name] = c;
        setChannels(channels);
        setChannel(c);
      }
      // TODO unsubscribe from channel
      return () => {};
    }
    return () => {};
  }, [socket, socketConnected, channels, channelName, param]);

  return channel;
};

export default useChannels;
