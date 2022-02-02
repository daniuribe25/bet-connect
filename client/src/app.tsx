/* eslint-disable unicorn/filename-case */
import { FunctionComponent, useEffect } from 'react';
import './app.css';
import { ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/client';
import { SnackbarProvider } from 'notistack';
import { CssBaseline } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import { Helmet } from 'react-helmet';
import globalTheme from 'styles/global-theme';
import theme from './styles/theme';
import AppRouter from './app-router';
import { loadUser } from './redux/actions/session-actions';
import { RootState } from './redux/root-reducer';
import DismissButton from './components/dismiss-button';
import SocketProvider from './providers/socket-provider';
import { ModalProvider } from './util/modal-context/modal-context';
import { ToastProvider } from './util/toast-context/toast-context';
import {
  REACT_APP_SOCKET_EP,
  REACT_APP_PAYPAL_CLIENT_ID,
  REACT_APP_INTERCOM_ID,
} from './helpers/env';
import useScript from './hooks/use-scripts';
import { setStoreProperty } from './redux/slices/lobby-slice';
import { loadFeatureFlags } from './redux/actions/lobby-actions';
import { trackPage } from './helpers/segment-analytics';
import Wrap from './layouts/wrap';

const history = createBrowserHistory();

let prevPath: any = null;

// listen and notify Segment of client-side page updates
history.listen(({ location }) => {
  if (location.pathname !== prevPath) {
    prevPath = location.pathname;
    trackPage();
  }
});

const REFRESH_WALLET_TIME = 180000;

const App: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { authToken, isFetching } = useSelector(
    (state: RootState) => state.session,
  );

  const apollo = useApolloClient();
  useScript(
    `https://www.paypal.com/sdk/js?client-id=${REACT_APP_PAYPAL_CLIENT_ID}&intent=authorize&disable-funding=card`,
  );
  const loadUserInfo = async (): Promise<void> => {
    await dispatch(loadUser({ apollo }));
  };

  useEffect(() => {
    (window as any).intercomSettings = {
      app_id: REACT_APP_INTERCOM_ID,
      hide_default_launcher: false,
    };

    if (typeof (window as any).Intercom === 'function') {
      (window as any).Intercom('update', (window as any).intercomSettings);
    }
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [authToken]);

  useEffect(() => {
    dispatch(setStoreProperty(['updateWallet', new Date().getTime()]));
    const intervalId = setInterval(() => {
      dispatch(setStoreProperty(['updateWallet', new Date().getTime()]));
    }, REFRESH_WALLET_TIME);
    dispatch(loadFeatureFlags({ apollo }));
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <SnackbarProvider
      maxSnack={3}
      preventDuplicate
      action={(key) => <DismissButton id={key} />}
      hideIconVariant
      autoHideDuration={8000}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      <Helmet>
        <script
          src={`https://widget.intercom.io/widget/${REACT_APP_INTERCOM_ID}`}
          defer
        />
      </Helmet>
      <StyledComponentsThemeProvider theme={globalTheme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SocketProvider wsUrl={REACT_APP_SOCKET_EP || '/socket'}>
            <Wrap>
              <ToastProvider>
                <ModalProvider>
                  <AppRouter isFetching={isFetching} authToken={authToken} />
                </ModalProvider>
              </ToastProvider>
            </Wrap>
          </SocketProvider>
        </ThemeProvider>
      </StyledComponentsThemeProvider>
    </SnackbarProvider>
  );
};

export default App;
