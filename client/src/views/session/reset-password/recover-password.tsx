import { FunctionComponent, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Box, createStyles, Grid, makeStyles, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useApolloClient } from '@apollo/client';
import Pill from 'components/core/pill';
import TopHeader from 'components/top-header';
import { setStoreProperty } from 'redux/slices/session-slice';
import { makeVerificationCode } from 'helpers/common';
import {
  REACT_APP_TWILIO_AUTH_TOKEN,
  REACT_APP_TWILIO_CID,
  REACT_APP_TWILIO_FROM_PHONE,
} from 'helpers/env';
import { RootState } from 'redux/root-reducer';
import Loading from 'components/loading';
import { recoverPassword, sendPasswordEmail } from 'redux/actions/session-actions';
import { useLoginStyles } from 'styles/index';
import { VerificationType } from '../login/components/phone-email-verification-step';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: '#031725',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: 'calc(100vh - 84px)',
      padding: 0,
    },
    loginBox: {
      backgroundColor: '#031725',
      maxWidth: '600px',
      borderRadius: '10px',
      margin: '0',
    },
    phonePanel: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      padding: '0rem 1.2rem 1rem',
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
    nextBtnCont: ({ isKeyboardOpen }: any) => ({
      marginTop: '2rem',
      margin: !isKeyboardOpen ? '0' : '0 5%',
      position: !isKeyboardOpen ? 'absolute' : 'relative',
      bottom: 10,
      width: !isKeyboardOpen ? '90%' : '100%',
      maxWidth: '600px',
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
      marginTop: '0.8rem'
    },
  }),
);

const RecoverPassword: FunctionComponent = () => {
  const [userInput, setUserInput] = useState('1');
  const dispatch = useDispatch();
  const [verificationType, setVerificationType] = useState(VerificationType.phone);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const styles = useStyles({ isKeyboardOpen });
  const loginStyles = useLoginStyles();
  const history = useHistory();
  const apollo = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const { loading } = useSelector(({ session }: RootState) => session);

  const handleChangeUserInput = (inp: string): void =>
    setUserInput(inp);

  // eslint-disable-next-line consistent-return
  const sendPassword = async (pw: string): Promise<any> => {
    const body = `Your temporary PL Connect password is ${pw}, please login and change your password from the left side menu`;
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

  const handleSubmit = async (): Promise<void> => {
    if (!userInput) { return; }
    if (verificationType === VerificationType.phone && userInput.length < 9) {
      enqueueSnackbar('please enter a valid phone', { variant: 'error' });
      return;
    }
    if (verificationType === VerificationType.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userInput)) {
      enqueueSnackbar('please enter a valid email', { variant: 'error' });
      return;
    }
    const password = `PL${makeVerificationCode(6)}`;
    let resp: any = null;
    if (verificationType === VerificationType.phone) {
      resp = await dispatch(recoverPassword({ apollo, values: { phone: userInput, password } }));
    } else {
      resp = await dispatch(sendPasswordEmail({ apollo, values: { email: userInput } }));
    }
    if (resp.payload.ok) {
      if (verificationType === VerificationType.phone) {
        await sendPassword(password);
      }
      dispatch(setStoreProperty(['loading', false]));
      history.push('/login');
    } else {
      enqueueSnackbar('Error: please try again', { variant: 'error' });
    }
  };

  const handleUseDifferentVerificationType = (): void => {
    setUserInput('');
    setVerificationType(verificationType === VerificationType.phone ? VerificationType.email : VerificationType.phone)
  }

  const handleBlur = (): void => {
    setTimeout(() => setIsKeyboardOpen(false), 100);
  }

  return (
    <>
      <Loading show={loading} />
      <div className={styles.root}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={styles.loginBox}
        >
          <TopHeader
            buttonText="Log in"
            onButtonClick={() => history.push('/login')}
            style={{ width: '95%', paddingTop: '1.5rem' }}
          />
          <div className={styles.phonePanel}>
            <h2>{`Enter your ${verificationType === VerificationType.phone ? "phone number" : "email address"}`}</h2>
            <span>
              {`
              We'll ${verificationType === VerificationType.phone ? "text" : "email"} you a temporary password you can use to login. After
              first login please change this password for a new one`}
            </span>
            <br />
            {verificationType === VerificationType.phone && (
              <>
                <span>
                  {`If you don't have a phone number registered, please contact
                  support`}
                </span>
                <br />
              </>
            )}

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
                    onBlur: () => {
                      setTimeout(() => setIsKeyboardOpen(false), 100);
                    },
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
                className={loginStyles.inputCont}
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
          </div>
          <Box
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
            className={styles.nextBtnCont}
          >
            <Pill variant="info" onClick={handleSubmit}>
              Confirm
            </Pill>
          </Box>
        </Grid>
      </div>
    </>
  );
};

export default RecoverPassword;
