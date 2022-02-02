/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { FunctionComponent, useEffect, useState } from 'react';
import { Channel, Socket } from 'phoenix';
import { useSelector } from 'react-redux';
import SocketContext from './socket-context';
import { RootState } from '../redux/root-reducer';

const SocketProvider: FunctionComponent<any> = ({ wsUrl, children }: any) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [channels, setChannels] = useState<any>({});
  const { authToken } = useSelector((state: RootState) => state.session);
  const [retry, setRetry] = useState(0);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  useEffect(() => {
    if (authToken && typeof authToken === 'string' && wsUrl) {
      const s = new Socket(wsUrl, {
        params: { token: authToken },
        reconnectAfterMs: () => 1000,
      });
      s.connect();
      s.onOpen(() => {
        setTimeout(() => {
          setSocket(s);
          setSocketConnected(true);
        }, 1);
      });
      setChannels({});
      s.onError(() => {
        s.disconnect();
        setRetry(retry + 1);
        setSocketConnected(false);
      });
    } else if (socket) {
      // TODO remove loop
      for (const key in channels) {
        const c: Channel = channels[key];
        c.leave();
        socket.remove(c);
      }
      // TODO use a real error  when dicsonnecting
      // eslint-disable-next-line no-console
      socket.disconnect(() => console.log('disconecting from server'), 1000);
      setSocket(null);
    }
  }, [authToken, retry]);

  return (
    <SocketContext.Provider
      value={{ socket, channels, setChannels, socketConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
