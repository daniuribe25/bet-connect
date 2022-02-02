import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser as getCurrentUserQuery, verifyUserEmailQuery } from '../../api/gql/queries';
import { REACT_APP_API_BASE_URL } from '../../helpers/env';
import { buildMessages, uuidv4 } from '../../helpers/common';
import storage, { AUTH_TOKEN } from '../../helpers/storage';
import { addFundsMutation, updateUserPassword } from '../../api/gql/mutations';
import { handleSessionErrors } from '../slices/session-slice';
import { SignupSteps } from '../../helpers/pl-types';
import { getUserByEmail, getUserByPhone } from '../../api/gql/mutations/create-user-by-phone';
import { RootState } from '../root-reducer';
import { recoverUserPasswordWithEmail, resetUserPassword } from '../../api/gql/mutations/updater-user-password';
import {
  trackIdentity,
  trackSignUpCompleted,
} from '../../helpers/segment-analytics';
import updateProfileStatus from '../../api/gql/mutations/confirm-private-profile';

const authenticate = async (
  authUserMutation: any,
  values: any,
  storeToken: boolean,
): Promise<{ token?: string; errors?: any }> => {
  const input: any = { password: values.password };
  const isnum = /^\d+$/.test(values.phone);
  if (isnum) {
    input.phone = values.phone;
  } else {
    input.email = values.phone.toLowerCase();
  }
  const respAuth = await authUserMutation({ variables: { input } });
  if (respAuth.data?.authenticateUser?.errors?.length) {
    const errors = respAuth.data.authenticateUser.errors.map(
      (x: any) => x.message,
    );
    return { errors: buildMessages(errors, 'error') };
  }
  const token = respAuth.data?.authenticateUser?.result?.token;
  if (storeToken) storage.save(AUTH_TOKEN, token);

  if (respAuth.data?.authenticateUser?.result?.is_admin) {
    window.open(`${REACT_APP_API_BASE_URL}/sync?token=${token}`, '_blank');
  }
  return { token };
};

export const loadUser = createAsyncThunk(
  'session/loadUser',
  async ({ apollo }: any, { dispatch }) => {
    const token = storage.get(AUTH_TOKEN);
    let currentUser;
    try {
      currentUser = await apollo
        .query({ query: getCurrentUserQuery })
        .then((r: any) => r.data?.currentUser);
    } catch (err) {
      dispatch(handleSessionErrors({}));
    }
    return { currentUser, token };
  },
);

export const authUser = createAsyncThunk(
  'session/authUser',
  async ({ values, authUserMutation, apollo }: any, { rejectWithValue }) => {
    try {
      const authResp: any = await authenticate(authUserMutation, values, true);

      if (authResp.errors) return rejectWithValue(authResp.errors);

      const user = await apollo
        .query({ query: getCurrentUserQuery })
        .then((r: any) => r.data?.currentUser);

      return { user, token: authResp };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const changePassword = createAsyncThunk(
  'session/changePassword',
  async ({ values, userId, apollo }: any, { rejectWithValue }) => {
    try {
      const resp = await apollo.mutate({
        mutation: updateUserPassword,
        variables: { input: values, id: userId },
      });

      if (resp.data.updateUserPassword.errors?.length)
        return rejectWithValue(
          buildMessages(
            resp.data.updateUserPassword.errors.map((x: any) => x.message),
            'error',
          ),
        );
      const alerts = {
        id: uuidv4(),
        messages: [
          {
            text: 'Your password has been changed',
            title: 'Success!',
            type: 'success',
          } as any,
        ],
      };
      return { alerts };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const recoverPassword = createAsyncThunk(
  'session/recoverPassword',
  async ({ values, apollo }: any, { rejectWithValue }) => {
    try {
      const { data } = await apollo.mutate({
        mutation: getUserByPhone,
        variables: { phone: values.phone },
      });

      if (data.getUserByPhone.errors?.length)
        return rejectWithValue(
          buildMessages(
            data.getUserByPhone.errors.map((x: any) => x.message),
            'error',
          ),
        );

      if (data?.getUserByPhone?.id) {
        const resp = await apollo.mutate({
          mutation: resetUserPassword,
          variables: {
            input: {
              password: values.password,
              passwordConfirmation: values.password,
            },
            id: data?.getUserByPhone?.id,
          },
        });

        if (resp.data.adminUpdateUserPassword.errors?.length)
          return rejectWithValue(
            buildMessages(
              resp.data.adminUpdateUserPassword.errors.map(
                (x: any) => x.message,
              ),
              'error',
            ),
          );
      }

      const alerts = {
        id: uuidv4(),
        messages: [
          {
            text:
              "If the phone number exists, it should receive a SMS with a temporary password. please change it once you're in",
            title: 'Success!',
            type: 'success',
          } as any,
        ],
      };
      return { alerts, ok: true };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const sendPasswordEmail = createAsyncThunk(
  'session/sendPasswordEmail',
  async ({ values, apollo }: any, { rejectWithValue }) => {
    try {
      const { data: userData } = await apollo.mutate({
        mutation: getUserByEmail,
        variables: { email: values.email },
      });

      if (userData.getUserByEmail.errors?.length)
        return rejectWithValue(
          buildMessages(
            userData.getUserByEmail.errors.map((x: any) => x.message),
            'error',
          ),
        );

      if (!userData.getUserByEmail?.id) {
        return rejectWithValue(
          buildMessages(
            ['Email not found'],
            'error',
          ),
        );
      }

      const { data } = await apollo.mutate({
        mutation: recoverUserPasswordWithEmail,
        variables: { id: userData.getUserByEmail.id },
      });

      if (data.resetPassword.errors?.length)
      return rejectWithValue(
        buildMessages(
          data.resetPassword.errors.map((x: any) => x.message),
          'error',
        ),
      );

      const alerts = {
        id: uuidv4(),
        messages: [
          {
            text:
              "If the email address exists, it should receive an email with a temporary password. please change it once you're in",
            title: 'Success!',
            type: 'success',
          } as any,
        ],
      };
      return { alerts, ok: true };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
})


// eslint-disable-next-line consistent-return
const getNextStep = (step: string, privateProfile: boolean): any => {
  // eslint-disable-next-line default-case
  switch (step) {
    case 'STEP_1':
      return SignupSteps.gamerTag;
    case 'STEP_2':
      return SignupSteps.password;
    case 'STEP_3':
      return privateProfile ? SignupSteps.settings : SignupSteps.invite;
  }
};

export const registerUserbyStep = createAsyncThunk(
  'session/registerUserbyStep',
  async (
    {
      values,
      step,
      createUserByPhoneMutation,
      apollo,
      authUserMutation,
      updateGamerTagsMutation,
      confirmPrivateProfileMutation,
      updateUserPasswordMutation,
    }: any,
    { rejectWithValue, getState },
  ) => {
    try {
      // @ts-ignore
      let resp = null;
      let queryName = '';
      let alerts = {};
      let nextStep = null;
      const { session } = getState() as RootState;
      // eslint-disable-next-line default-case
      switch (step) {
        case SignupSteps.phoneVerification:
          resp = await apollo.query({
            query: (values.email ? getUserByEmail : getUserByPhone),
            variables: values,
          });
          if (resp.data?.getUserByPhone?.id || resp.data?.getUserByEmail?.id) {
            return {
              user: resp.data?.getUserByPhone || resp.data?.getUserByEmail,
              alerts,
              step: SignupSteps.phoneVerification,
              nextStep: getNextStep(
                resp.data?.getUserByPhone?.stepRegister || resp.data?.getUserByEmail?.stepRegister,
                resp.data?.getUserByPhone?.privateProfile || resp.data?.getUserByEmail?.privateProfile,
              ),
            };
          }
          resp = await createUserByPhoneMutation({
            variables: { input: values },
          });
          nextStep = SignupSteps.gamerTag;
          queryName = 'createAccountStepOne';

          break;
        case SignupSteps.gamerTag:
          resp = await updateGamerTagsMutation({
            variables: {
              input: values,
              id: session.userToSignup?.id || session.currentUser?.id,
            },
          });
          if (
            resp.data.createAccountStepTwo?.result?.stepRegister === 'STEP_2'
          ) {
            nextStep = SignupSteps.password;
          } else if (resp.data?.createAccountStepTwo?.privateProfile) {
            nextStep = SignupSteps.settings;
          } else {
            nextStep = SignupSteps.invite;
          }
          queryName = 'createAccountStepTwo';
          break;
        case SignupSteps.password:
          resp = await updateUserPasswordMutation({
            variables: { input: values, id: session.userToSignup?.id },
          });
          nextStep = SignupSteps.settings;
          queryName = 'createAccountStepThree';
          break;
        case SignupSteps.settings:
          resp = await confirmPrivateProfileMutation({
            variables: {
              id: session.userToSignup?.id || session.currentUser?.id,
            },
          });
          nextStep = SignupSteps.invite;
          if (
            !resp.data.updateProfileStatus.result?.id ||
            resp.data.updateProfileStatus.result?.privateProfile
          ) {
            if (!session.currentUser?.id) {
              alerts = buildMessages(
                [
                  'Please follow the instructions to make your profile public or contact support for help',
                ],
                'error',
              );
            }
          }
          queryName = 'updateProfileStatus';
          break;
      }

      if (resp.data[queryName].errors.length) {
        return rejectWithValue(
          buildMessages(
            resp.data[queryName].errors.map((mess: any) => mess.message),
            'error',
          ),
        );
      }

      if (step === SignupSteps.password) {
        const userResult = resp.data[queryName].result;
        trackIdentity(userResult);
        trackSignUpCompleted(userResult?.id, userResult.phone ? 'phone' : 'email');
        const authValues = {...values};
        authValues.phone = userResult.phone || userResult.email;
        const authResp: any = await authenticate(
          authUserMutation,
          authValues,
          false,
        );
        if (authResp.errors) return rejectWithValue(authResp.errors);

        return {
          user: resp.data[queryName].result,
          token: authResp.token,
          alerts,
          nextStep,
        };
      }

      return { user: resp.data[queryName].result, alerts, nextStep };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const verifyPrivateProfile = createAsyncThunk(
  'session/verifyPrivateProfile',
  async ({ apollo }: any, { rejectWithValue, getState }) => {
    const { session } = getState() as RootState;
    const resp: any = await apollo.mutate({
      mutation: updateProfileStatus,
      variables: { id: session.currentUser?.id },
    });

    if (resp.data?.updateProfileStatus?.errors?.length) {
      return rejectWithValue(
        buildMessages(
          resp.data.updateProfileStatus.errors.map((mess: any) => mess.message),
          'error',
        ),
      );
    }
    return { user: resp.data.updateProfileStatus.result };
  },
);

export const verifyEmailAddress = createAsyncThunk(
  'session/verifyEmailAddress',
  async ({ apollo, code, email }: any, { rejectWithValue }) => {
    try {
      await apollo.query({
        query: verifyUserEmailQuery,
        variables: { code, email },
      });

      return { ok: true };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);

export const addFunds = createAsyncThunk(
  'session/addFunds',
  async (
    { apollo, userId, authorizationId, orderId, funds }: any,
    { rejectWithValue },
  ) => {
    try {
      const variables = { id: userId, input: { authorizationId, orderId } };
      const resp = await apollo.mutate({
        mutation: addFundsMutation,
        variables,
      });

      if (resp.data.paypalTransactionProcess.errors.length) {
        return rejectWithValue(
          buildMessages(
            resp.data.paypalTransactionProcess.errors.map(
              (mess: any) => mess.message,
            ),
            'error',
          ),
        );
      }

      const alerts = buildMessages(
        [`$${funds} added to your wallet`],
        'success',
      );

      return {
        wallet: resp.data.paypalTransactionProcess.result.wallet,
        alerts,
      };
    } catch (err: any) {
      return rejectWithValue(buildMessages([err.message], 'error'));
    }
  },
);
