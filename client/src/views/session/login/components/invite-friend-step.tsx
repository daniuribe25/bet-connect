import { FunctionComponent } from 'react';
import 'react-phone-input-2/lib/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { setStoreProperty } from 'redux/slices/session-slice';
// import { setStoreProperty as setLobbyStoreProperty } from 'redux/slices/lobby-slice';
import middleImage from 'assets/images/invite-bg.png';
import { RootState } from 'redux/root-reducer';
import { SignupSteps } from 'helpers/pl-types';
import storage, { AUTH_TOKEN } from 'helpers/storage';
import { handleInviteFriend } from 'helpers/common';
import styled from 'styled-components';
import SVG from 'assets/images/svgs';
// import { useApolloClient } from '@apollo/client';
// import { getTeams } from 'redux/actions/lobby-actions';
import Pill from 'components/core/pill';
import {
  PageWrap,
  ContentWrap,
  Heading,
  Info,
  BottomWrap,
} from './components';

const MainButton = styled(Pill)`
  margin-bottom: 16px;
`;

const Dollars = styled(SVG)`
  position: relative;
  width: 100px;
  filter: drop-shadow(0px 0px 14px #23ca78);
`;

// eslint-disable-next-line import/prefer-default-export
export const InviteFriendStep: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { signupToken } = useSelector(
    ({ session }: RootState) => session,
  );
  // const apollo = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const handleDone = async (): Promise<void> => {
    enqueueSnackbar(
      'Congrats on signing up for the PL Connect Beta. Good luck and have fun!',
      { variant: 'success' },
    );
    if (signupToken) {
      await dispatch(setStoreProperty(['authToken', signupToken]));
      storage.save(AUTH_TOKEN, signupToken);
      setTimeout(() => {
        history.push('/team');
        (window as any).location.reload();
      }, 1000);
    } else {
      history.push('/login');
    }
    dispatch(setStoreProperty(['signupStep', SignupSteps.phoneVerification]));
    dispatch(setStoreProperty(['userToSignup', null]));
  };

  return (
    <PageWrap>
      <ContentWrap isKeyboardOpen={false} style={{ alignItems: 'center' }}>
        <div>
          <Dollars icon="content:Dollars" alt="coin" className={undefined} />
        </div>
        <Heading>$25 added to your wallet</Heading>
        <Info>Expires in 24 hours</Info>

        <div>
          <img
            src={middleImage}
            alt="COD Agents"
            style={{ position: 'absolute', left: '0px', width: '100%' }}
          />
        </div>
      </ContentWrap>
      <BottomWrap style={{ alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Heading>Give your friends $25 each</Heading>
          <Info>
            You need a squad to play PL Connect. Invite your friends and we will
            give the first 5 to sign up $25 each to play with free!
          </Info>
        </div>
        <MainButton
          variant="info"
          onClick={() => handleInviteFriend(enqueueSnackbar)}
        >
          Send invites
        </MainButton>
        <span
          onClick={handleDone}
          onKeyPress={handleDone}
          tabIndex={0}
          role="button"
          className="done"
        >
          Done
        </span>
      </BottomWrap>
    </PageWrap>
  );
};
