import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Formik, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient, useMutation } from '@apollo/client';
import { fontMediumSmall } from 'styles/typography';
import { useHistory } from 'react-router';
import { authUser } from 'redux/actions/session-actions';
import { authenticateUser as authenticateUserMutation } from 'api/gql/mutations';
import Loading from 'components/loading';
import { RootState } from 'redux/root-reducer';
import useAlerts from 'hooks/use-alerts';
import { setStoreProperty as setSessionStoreProperty } from 'redux/slices/session-slice';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import TopHeader from 'components/top-header';
import { getUserPlatform } from 'helpers/common';
import { loginValidation } from './validations';
import LoginForm from './components/login-form';

const HeaderWrapper = styled.div`
  padding: 0 16px;
`;

const ForgotPasswordText = styled.div`
  text-align: center;
  padding-top: 16px;
  color: ${({ theme }) => theme.info.text.secondary};
  ${fontMediumSmall};
  font-weight: 400;
`;

export type LoginFormValues = {
  phone?: string;
  password?: string;
};

const LoginScreen: FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [authUserMutation] = useMutation(authenticateUserMutation);
  const apollo = useApolloClient();
  const { loading, alerts } = useSelector(({ session }: RootState) => session);
  const { teamUsers } = useSelector(({ lobby }: RootState) => lobby);
  useAlerts(alerts, setSessionStoreProperty);

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    const resp: any = await dispatch(
      authUser({
        values: {
          ...values,
          phone:
            values.phone && values.phone[0] === '+'
              ? values.phone?.replace('+', '')
              : values.phone,
        },
        authUserMutation,
        apollo,
      }),
    );
    if (resp.payload.token) {
      const newTeam = [...teamUsers];
      newTeam[0] = {
        userId: resp.payload.user.id,
        user: resp.payload.user,
        platform: getUserPlatform(resp.payload.user).platform,
        playerTag: getUserPlatform(resp.payload.user).username,
      };
      dispatch(setStoreProperty(['teamUsers', newTeam]));
    }
  };

  const handleGoToResetPassword = (): void => history.push('/recoverPassword');

  const formikRender: FunctionComponent<FormikProps<LoginFormValues>> = (
    formikProps: FormikProps<LoginFormValues>,
  ) => <LoginForm formikProps={formikProps} />;

  return (
    <>
      <HeaderWrapper>
        <TopHeader
          buttonText="Sign up"
          onButtonClick={() => history.push('/register')}
        />
      </HeaderWrapper>

      <div>
        <Loading show={loading} />
        <div>
          <Formik
            initialValues={{ phone: '+1', password: '' }}
            validate={loginValidation}
            onSubmit={handleSubmit}
          >
            {formikRender}
          </Formik>
          <ForgotPasswordText
            onClick={handleGoToResetPassword}
            onKeyPress={handleGoToResetPassword}
            tabIndex={0}
            role="button"
          >
            Forgot password
          </ForgotPasswordText>
        </div>
      </div>
    </>
  );
};

export default LoginScreen;
