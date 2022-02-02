import { FunctionComponent } from 'react';
import { useApolloClient } from '@apollo/client';
import { Formik, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Loading from 'components/loading';
import useAlerts from 'hooks/use-alerts';
import { changePassword } from 'redux/actions/session-actions';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/session-slice';
import { useResetPasswordStyles } from 'styles/index';
import { resetPasswordValidation } from '../login/validations';
import ResetPasswordForm from './components/reset-password-form';

export type ResetPasswordFormValues = {
  password?: string;
  repeatPassword?: string;
  currentPassword?: string;
};

export const SendEmail: FunctionComponent = () => {
  const styles = useResetPasswordStyles();
  const dispatch = useDispatch();
  const apollo = useApolloClient();
  const { currentUser, alerts, loading } = useSelector(
    ({ session }: RootState) => session,
  );
  useAlerts(alerts, setStoreProperty);
  const history = useHistory();

  const handleSubmit = async (
    value: ResetPasswordFormValues,
  ): Promise<void> => {
    const values = {
      currentPassword: value.currentPassword,
      password: value.password,
      passwordConfirmation: value.repeatPassword,
    };
    const a: any = await dispatch(
      changePassword({ values, userId: currentUser.id, apollo }),
    );
    if (a.type === 'session/changePassword/fulfilled') {
      history.push('/bet');
    }
  };

  const formikRender: FunctionComponent<FormikProps<
    ResetPasswordFormValues
  >> = (formikProps: FormikProps<ResetPasswordFormValues>) => (
    <ResetPasswordForm formikProps={formikProps} />
  );

  return (
    <>
      <Loading show={loading} />
      <div className={styles.container}>
        <Formik
          initialValues={{
            currentPassword: '',
            password: '',
            repeatPassword: '',
          }}
          validate={resetPasswordValidation}
          onSubmit={handleSubmit}
        >
          {formikRender}
        </Formik>
      </div>
    </>
  );
};

export default SendEmail;
