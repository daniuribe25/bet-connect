/* eslint-disable camelcase */
import { FunctionComponent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import Loading from 'components/loading';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/session-slice';
import useAlerts from 'hooks/use-alerts';
import { SignupSteps } from 'helpers/pl-types';
import { trackSignUpStarted } from 'helpers/segment-analytics';
import TopHeader from 'components/top-header';
import { PhoneEmailVerificationStep } from './components/phone-email-verification-step';
import { GamerTagStep } from './components/gamer-tag-step';
import { PasswordStep } from './components/password-step';
import './login.css';
import SettingsStep from './components/settings-step';
import { InviteFriendStep } from './components/invite-friend-step';

export type RegisterFormValues = {
  email?: string;
  phone?: string;
  xbl_platform_username?: string;
  psn_platform_username?: string;
  battlenet_platform_username?: string;
  password_confirmation?: string;
  password?: string;
};

const SignUpWrapper = styled.div`
  position: relative;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: -webkit-fill-available;
  margin: auto;
  justify-content: space-between;
  padding: 16px;
`;

const RegisterScreen: FunctionComponent = () => {
  const history = useHistory();
  const { loading, alerts, signupStep } = useSelector(
    ({ session }: RootState) => session,
  );

  useAlerts(alerts, setStoreProperty);

  const handleGoToLogin = (): void => {
    history.push('/login');
    (window as any).location.reload();
  }

  useEffect(() => {
    trackSignUpStarted();
  }, []);

  return (
    <SignUpWrapper>
      <TopHeader
        buttonText="Log in"
        onButtonClick={handleGoToLogin}
      />
      <Loading show={loading} />
      {signupStep === SignupSteps.phoneVerification && (
        <PhoneEmailVerificationStep />
      )}
      {signupStep === SignupSteps.gamerTag && <GamerTagStep />}
      {signupStep === SignupSteps.password && <PasswordStep />}
      {signupStep === SignupSteps.settings && <SettingsStep />}
      {signupStep === SignupSteps.invite && <InviteFriendStep />}
    </SignUpWrapper>
  );
};

export default RegisterScreen;
