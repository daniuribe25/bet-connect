/* eslint-disable unicorn/filename-case */
import React, { FunctionComponent, Suspense, useEffect } from 'react';
import { CenterSpinner } from 'components/core/loading-spinner';
import './app.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { HmacSHA256 } from 'crypto-js';
import Tournaments from 'views/tournaments/tournaments';
import Tournament from 'views/tournaments/tournament';
import Activity from 'views/activity';
import FAQ from 'views/faq';
import {
  REACT_APP_INTERCOM_ID,
  REACT_APP_INTERCOM_API_KEY,
} from './helpers/env';
import Layout from './views/layout/layout';
import { getTeams } from './redux/actions/lobby-actions';
import { RootState } from './redux/root-reducer';
import { LobbySteps } from './helpers/pl-types';
import TeamBetSlip from './views/history/components/team-bet-slip';
import UserSocketHandler from './components/user-socket-handler';
import LandingPage from './views/landing/landing-page';
import { verifyPrivateProfile } from './redux/actions/session-actions';

const ResetPasswordScreen = React.lazy(
  () => import('./views/session/reset-password/reset-password'),
);
const RegisterScreen = React.lazy(
  () => import('./views/session/login/register'),
);
const LoginScreen = React.lazy(() => import('./views/session/login/login'));
const BetGameScreen = React.lazy(() => import('./views/lobby/components/task-list/task-list'));
const SelectPlayersScreen = React.lazy(
  () => import('./views/team/select-players'),
);
const AddFundsScreen = React.lazy(() => import('./views/paypal/add-funds'));
const RecoverPasswordScreen = React.lazy(
  () => import('./views/session/reset-password/recover-password'),
);
const NoStatsScreen = React.lazy(() => import('./views/team/no-stats'));
const UpdateGamerTagScreen = React.lazy(
  () => import('./views/team/update-gamer-tag'),
);

type PrivateRouteProps = {
  component: React.FC | any;
  authed?: boolean | null;
  path: string;
  exact?: boolean;
};

const PrivateRoute: FunctionComponent<PrivateRouteProps> = (
  props: PrivateRouteProps,
) => {
  const { component: Component, authed, path, exact } = props;
  const history = useHistory();
  const apollo = useApolloClient();
  const { step } = useSelector(({ lobby }: RootState) => lobby);
  const { currentUser } = useSelector(({ session }: RootState) => session);

  const dispatch = useDispatch();

  useEffect(() => {
    const { id } = currentUser || {};
    const userHash = HmacSHA256(
      id,
      REACT_APP_INTERCOM_API_KEY || '',
    ).toString();

    (window as any).intercomSettings = {
      app_id: REACT_APP_INTERCOM_ID,
      hide_default_launcher: true,
      user_hash: userHash,
      user_id: id,
      ...currentUser,
    };

    if (typeof (window as any).Intercom === 'function') {
      (window as any).Intercom('update', (window as any).intercomSettings);
    }
  }, []);

  useEffect(() => {

    if((window as any).location.pathname.indexOf('tournament') === -1){
      // eslint-disable-next-line default-case
      switch (step) {
      case LobbySteps.players:
        history.push('/team');
        break;

      case LobbySteps.tasks:
        history.push('/bet');
        break;

      case LobbySteps.activeBet:
        history.push('/activeBet');
        break;
    }
  }
  }, [step]);

  useEffect(() => {
    // dispatch(loadStep({ apollo }));
    dispatch(getTeams({ apollo, currentUser }));
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(verifyPrivateProfile({ apollo }));
    }
  }, [currentUser?.id]);

  return (
    <Route
      path={path}
      exact={exact}
      render={(routeProps: any) =>
        authed ? (
          <Layout>
            <Component {...routeProps} />
          </Layout>
        ) : (
          <Redirect to={{ pathname: '/login' }} />
        )
      }
    />
  );
};
interface AppRouterProps {
  isFetching: boolean;
  authToken?: string | null;
}

const AppRouter: FunctionComponent<AppRouterProps> = (
  props: AppRouterProps,
) => {
  const { authToken, isFetching } = props;
  const { isCaptain } = useSelector(({ lobby }: RootState) => lobby);
  return !isFetching ? (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        {authToken && <UserSocketHandler />}
        <Switch>
          <Route exact path="/">
            {!authToken ? (
              <Route exact path="/" component={LandingPage} />
            ) : (
              <Redirect to="/team" />
            )}
          </Route>
          <Route exact path="/login">
            {!authToken ? (
              <Route exact path="/login" component={LoginScreen} />
            ) : (
              <Redirect to="/team" />
            )}
          </Route>
          <Route exact path="/register" component={RegisterScreen} />
          <Route
            exact
            path="/recoverPassword"
            component={RecoverPasswordScreen}
          />
          <Route
            exact
            path="/faq"
            component={FAQ}
          />
          <PrivateRoute
            authed={Boolean(authToken)}
            exact
            path="/setNewPassword"
            component={ResetPasswordScreen}
          />
          <PrivateRoute
            authed={Boolean(authToken)}
            exact
            path="/activity"
            component={Activity}
          />
          <PrivateRoute
            authed={Boolean(authToken)}
            exact
            path="/addFunds"
            component={AddFundsScreen}
          />
          <PrivateRoute
            authed={Boolean(authToken)}
            exact
            path="/team"
            component={SelectPlayersScreen}
          />
          <PrivateRoute
            authed={Boolean(authToken) && isCaptain}
            exact
            path="/bet"
            component={BetGameScreen}
          />
          <PrivateRoute
            authed={Boolean(authToken)}
            exact
            path="/activeBet"
            component={TeamBetSlip}
          />
          <PrivateRoute
            authed={Boolean(authToken)}
            exact
            path="/tournaments"
            component={Tournaments}
          />
          <PrivateRoute
            authed={Boolean(authToken)}
            exact
            path="/tournament/:tournamentId"
            component={Tournament}
          />
          <PrivateRoute
            authed={Boolean(authToken)}
            exact
            path="/noStats"
            component={NoStatsScreen}
          />
          <PrivateRoute
            authed={Boolean(authToken)}
            exact
            path="/updateGamerTag"
            component={UpdateGamerTagScreen}
          />

          <Route exact path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </Suspense>
  ) : (
    <CenterSpinner size={80} />
  );
};

export default AppRouter;
