import { FunctionComponent, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { createStyles, makeStyles, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useApolloClient, useMutation } from '@apollo/client';
import { useLoginStyles } from 'styles/index';
import { setStoreProperty } from 'redux/slices/session-slice';
import { SignupSteps } from 'helpers/pl-types';
import { makeVerificationCode } from 'helpers/common';
import {
  REACT_APP_TWILIO_AUTH_TOKEN,
  REACT_APP_TWILIO_CID,
  REACT_APP_TWILIO_FROM_PHONE,
} from 'helpers/env';
import { registerUserbyStep, verifyEmailAddress } from 'redux/actions/session-actions';
import createUserByPhone from 'api/gql/mutations/create-user-by-phone';
import {
  trackNewPhoneCodeRequested,
  trackSignUpMethodChosen,
  trackVerificationCodeConfirmed,
  trackSignUpStarted,
} from 'helpers/segment-analytics';
import Pill from 'components/core/pill';
import SignupProgressBar from './signup-progress-bar';
import {
  PageWrap,
  ContentWrap,
  Heading,
  Info,
  BottomWrap,
} from './components';

const useStyles = makeStyles(() =>
  createStyles({
    phoneVerificationPanel: {
      display: 'flex',
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      color: '#fff',
      textAlign: 'left',
      '& h2': {
        marginTop: '0px',
        marginBottom: '7px',
        fontSize: '25px',
      },
      '& span': {
        fontSize: '13px',
      },
    },
    emailInputCont: {
      marginTop: '25px !important',
    },
    phoneInput: {
      borderRadius: '28px',
      fontSize: '17px',
      width: '100%',
      padding: '1.5rem 3.5rem 0.4rem',
    },
    phoneLabel: {
      position: 'relative',
      top: '25px',
      left: '55px',
      zIndex: 2,
      color: '#2F9BD8',
    },
    nextBtnCont: () => ({
      width: '100%',
      fontSize: '25px',
      fontWeight: 900,
      lineHeight: '30px',
      letterSpacing: '0.04em',
    }),
    nextBtn: {
      '& span': {
        fontSize: '26px',
      },
    },
    sentAgainText: {
      fontSize: '16px !important',
      color: '#2F9BD8',
      textAlign: 'center',
      marginTop: '0.8rem',
      cursor: 'pointer',
    },
  }),
);

// eslint-disable-next-line no-shadow
export enum VerificationType {
  phone,
  email
}

// eslint-disable-next-line import/prefer-default-export
export const PhoneEmailVerificationStep: FunctionComponent = () => {
  const [userInput, setUserInput] = useState('');
  const [code, setCode] = useState('');
  const [verificationType, setVerificationType] = useState(VerificationType.email);
  const [sentMessage, setSentMessage] = useState('');
  const [timesAskedNewCode, setTimesAskedNewCode] = useState(0);
  const dispatch = useDispatch();
  const [confirmCode, setConfirmCode] = useState<string | null>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const styles = useStyles({ isKeyboardOpen });
  const loginStyles = useLoginStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [createUserByPhoneMutation] = useMutation(createUserByPhone);
  const apollo = useApolloClient();

  const handleChangeUserInput = (inp: string): void => setUserInput(inp);
  const handleChangeCode = (c: any): void => setCode(c.target.value);

  // eslint-disable-next-line consistent-return
  const validatePhoneNumber = async (cd: string): Promise<any> => {
    const body = `Your PL Connect code is ${cd}, please enter this code in the validation field`;
    setSentMessage(body);
    const auth = btoa(`${REACT_APP_TWILIO_CID}:${REACT_APP_TWILIO_AUTH_TOKEN}`);
    const query = `Body=${body}&From=${REACT_APP_TWILIO_FROM_PHONE}&To=+${userInput}`;
    try {
      dispatch(setStoreProperty(['loading', true]));
      return fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${REACT_APP_TWILIO_CID}/Messages.js`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Authorization: `Basic ${auth})`,
          },
          body: query,
        },
      );
    } catch (err) {
      dispatch(setStoreProperty(['loading', false]));
      enqueueSnackbar('Error: please try again', { variant: 'error' });
    }
  };

  const validateEmailAdrress = async (cd: string): Promise<any> => {
    const resp: any = await dispatch(
      verifyEmailAddress({ apollo, code: cd, email: userInput }),
    );
    if (resp?.payload?.ok) { return resp?.payload }
    return { ok: false }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSubmit = async () => {
    if (!confirmCode) {
      if (userInput.length < 8) {
        enqueueSnackbar('Invalid phone number', { variant: 'error' });
        return;
      }
      const cd = makeVerificationCode(5);
      let resp: any = null;
      if (verificationType === VerificationType.phone) {
        resp = await validatePhoneNumber(cd);
      } else {
        resp = await validateEmailAdrress(cd);
      }
      dispatch(setStoreProperty(['loading', false]));
      if (resp?.ok) {
        setConfirmCode(cd);
      } else {
        enqueueSnackbar('Error: please try again', { variant: 'error' });
      }
    } else if (code === confirmCode) {
      trackVerificationCodeConfirmed(timesAskedNewCode);
      trackSignUpMethodChosen(verificationType === VerificationType.phone ? 'phone' : 'email');

      const values: { phone?: string, email?: string } = {};
      if (verificationType === VerificationType.phone) values.phone = userInput;
      else values.email = userInput;

      const resp: any = await dispatch(
        registerUserbyStep({
          createUserByPhoneMutation,
          apollo,
          step: SignupSteps.phoneVerification,
          values,
        }),
      );
      if (resp?.payload?.user?.stepRegister === 'STEP_4') {
        enqueueSnackbar(
          'Account already registered with this phone, please log in',
          { variant: 'success' },
        );
        history.push('/login');
      }
    } else {
      enqueueSnackbar('wrong validation code', { variant: 'error' });
    }
  };

  const handleSentAgain = (): void => {
    setTimesAskedNewCode(timesAskedNewCode + 1);
    trackNewPhoneCodeRequested(sentMessage);
    setConfirmCode(null);
  };

  const handleUseDifferentVerificationType = (): void => {
    setUserInput('');
    setVerificationType(verificationType === VerificationType.phone ? VerificationType.email : VerificationType.phone)
  }

  const handleBlur = (): void => {
    setTimeout(() => setIsKeyboardOpen(false), 100);
  }

  useEffect(() => {
    trackSignUpStarted();
  }, []);

  return (
    <PageWrap>
      <ContentWrap isKeyboardOpen={isKeyboardOpen}>
        <Heading>
          {!confirmCode ? 'Create your account' : 'Confirm your code'}
        </Heading>
        {!confirmCode ? (
          <>
            <Info>
              {
                `Enter your
                  ${verificationType === VerificationType.phone ? "phone number and we'll text " : "email address and we'll send "}
                you a code to verify your account.`
              }
            </Info>
            {verificationType === VerificationType.phone ? (
              <div>
                <span className={styles.phoneLabel}>Your phone number</span>
                <PhoneInput
                  country={'us'}
                  enableSearch
                  value={userInput}
                  onChange={handleChangeUserInput}
                  inputProps={{
                    className: styles.phoneInput,
                    onFocus: () => setIsKeyboardOpen(true),
                    onBlur: handleBlur,
                  }}
                  countryCodeEditable={false}
                />
              </div>
            ) : (
              <TextField
                id="email"
                label="Email address"
                autoComplete="on"
                variant="filled"
                type="email"
                name="email"
                fullWidth
                className={`${loginStyles.inputCont} ${styles.emailInputCont}`}
                InputProps={{ className: loginStyles.input }}
                onChange={e => handleChangeUserInput(e.target.value)}
                onFocus={() => setIsKeyboardOpen(true)}
                onBlur={handleBlur}
                value={userInput}
              />
            )}
            <span
              onClick={handleUseDifferentVerificationType}
              onKeyPress={handleUseDifferentVerificationType}
              tabIndex={-1}
              role="button"
              className={styles.sentAgainText}
            >
              Use {verificationType === VerificationType.phone ? 'email' : 'phone' } instead
            </span>
          </>
        ) : (
          <>
            <Info>We sent a code to {userInput}.</Info>
            <TextField
              id="code"
              label="Verification code"
              variant="filled"
              type="number"
              name="code"
              fullWidth
              className={loginStyles.inputCont}
              InputProps={{
                className: loginStyles.input,
                onFocus: () => setIsKeyboardOpen(true),
                onBlur: () => {
                  setTimeout(() => setIsKeyboardOpen(false), 100);
                },
              }}
              onChange={handleChangeCode}
              value={code}
            />
            {confirmCode && (
              <span
                onClick={handleSentAgain}
                onKeyPress={handleSentAgain}
                tabIndex={0}
                role="button"
                className={styles.sentAgainText}
              >
                Send again
              </span>
            )}
          </>
        )}
      </ContentWrap>
      <BottomWrap>
        <SignupProgressBar step={1} />
        <Pill variant="info" onClick={handleSubmit}>
          {!confirmCode ? 'Next' : 'Confirm'}
        </Pill>
      </BottomWrap>
    </PageWrap>
  );
};
