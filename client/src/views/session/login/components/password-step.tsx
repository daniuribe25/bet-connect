import { FunctionComponent, useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import {
  Checkbox,
  createStyles,
  FormControlLabel,
  FormGroup,
  IconButton,
  makeStyles,
  Typography,
  TextField,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useDispatch } from 'react-redux';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Formik, FormikProps } from 'formik';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { SignupSteps } from 'helpers/pl-types';
import Pill from 'components/core/pill';
import { setStoreProperty } from 'redux/slices/session-slice';
import { useLoginStyles } from 'styles/index';
import { updateUserPasswordMutation as updateUserPassword } from 'api/gql/mutations/create-user-by-phone';
import { registerUserbyStep } from 'redux/actions/session-actions';
import { authenticateUser as authenticateUserMutation } from 'api/gql/mutations';
import { trackPasswordEntered } from 'helpers/segment-analytics';
import { passwordStepValidation } from '../validations';
import {
  PageWrap,
  ContentWrap,
  IconWrapper,
  Heading,
  Info,
  BottomWrap,
} from './components';
import SignupProgressBar from './signup-progress-bar';

export type PasswordFormValues = {
  password?: string;
  confirmAge?: boolean;
  confirmTerms?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      padding: '1rem 1.2rem',
      color: '#fff',
      textAlign: 'left',
      '& h2': {
        marginBottom: '7px',
        fontSize: '25px',
      },
      '& span': {
        fontSize: '13px',
      },
    },
    checkboxLabel: {
      colorSecondary: {
        color: '#fff',
        '&$checked': {
          backgroundColor: '#fff',
          color: '##fff',
        },
      },
      '& span span svg': {
        fill: '#fff',
        width: '2rem',
        height: '2rem',
      },
      '& span.Mui-checked span svg': {
        fill: '#2F9BD8',
        width: '2rem',
        height: '2rem',
      },
    },
    nextBtnCont: ({ isKeyboardOpen }: any) => ({
      marginTop: '2rem',
      position: !isKeyboardOpen ? 'absolute' : 'relative',
      bottom: 10,
      width: !isKeyboardOpen ? '90%' : '100%',
    }),
    backButton: {
      color: '#3F7193 !important',
      position: 'relative',
      padding: '0',
    },
  }),
);

export const PasswordStep: FunctionComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const styles = useStyles({ isKeyboardOpen });
  const loginStyles = useLoginStyles();
  const [updateUserPasswordMutation] = useMutation(updateUserPassword);
  const [authUserMutation] = useMutation(authenticateUserMutation);

  const handleGoBack = (): { payload: any; type: string } =>
    dispatch(setStoreProperty(['signupStep', SignupSteps.gamerTag]));

  const handleSubmit = async (values: any): Promise<void> => {
    let error = false;
    if (!values.confirmAge) {
      enqueueSnackbar('You must be over 18 to use Players’Lounge Connect', {
        variant: 'error',
      });
      error = true;
    }
    if (!values.confirmTerms) {
      enqueueSnackbar('You must read and agree to use Players’Lounge Connect', {
        variant: 'error',
      });
      error = true;
    }
    if (error) return;

    trackPasswordEntered();
    await dispatch(
      registerUserbyStep({
        values: { password: values.password },
        updateUserPasswordMutation,
        authUserMutation,
        step: SignupSteps.password,
      }),
    );
  };

  const renderForm: FunctionComponent<FormikProps<PasswordFormValues>> = ({
    values,
    errors,
    touched,
    handleChange,
    handleSubmit: handleFormikSubmit,
  }: FormikProps<PasswordFormValues>) => (
    <>
      <ContentWrap isKeyboardOpen={isKeyboardOpen}>
        <TextField
          id="password"
          label="Password"
          autoComplete="on"
          type={showPassword ? 'text' : 'password'}
          name="password"
          variant="filled"
          fullWidth
          className={loginStyles.inputCont}
          color="secondary"
          onChange={handleChange}
          onBlur={() => setTimeout(() => setIsKeyboardOpen(false), 100)}
          onFocus={() => setIsKeyboardOpen(true)}
          value={values.password}
          style={{ marginTop: 10 }}
          error={Boolean(errors.password) && touched.password && true}
          helperText={errors.password && touched.password && errors.password}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                className={loginStyles.showPassButton}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            ),
            className: loginStyles.input,
          }}
        />

        <FormGroup>
          <FormControlLabel
            className={styles.checkboxLabel}
            control={
              <Checkbox
                disableRipple
                checked={values.confirmAge}
                onChange={handleChange}
                name="confirmAge"
              />
            }
            label={
              <Typography style={{ fontSize: '13px' }}>
                I confirm I am over 18 years old
              </Typography>
            }
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            className={styles.checkboxLabel}
            control={
              <Checkbox
                disableRipple
                checked={values.confirmTerms}
                onChange={handleChange}
                name="confirmTerms"
              />
            }
            label={
              <Typography style={{ fontSize: '13px' }}>
                I have read and agree to the{' '}
                <a
                  rel="noreferrer"
                  href="https://playerslounge.co/terms"
                  target="_blank"
                  style={{ color: '#2F9BD8' }}
                >
                  Terms & Conditions
                </a>
              </Typography>
            }
          />
        </FormGroup>
      </ContentWrap>
      <BottomWrap>
        <SignupProgressBar step={3} />
        <Pill
          variant="success"
          onClick={(e) => {
           e.preventDefault();
           handleFormikSubmit()
          }}
        >
          Create my account
        </Pill>
      </BottomWrap>
    </>
  );

  return (
    <PageWrap>
      <IconWrapper>
        <IconButton
          className={styles.backButton}
          component="span"
          onClick={handleGoBack}
        >
          <ArrowBackIosIcon />
        </IconButton>
      </IconWrapper>
      <Heading>Create a password</Heading>
      <Info>Your password must contain a capital letter and a number.</Info>

      <Formik
        initialValues={{ password: '', confirmAge: false, confirmTerms: false }}
        validate={passwordStepValidation}
        onSubmit={handleSubmit}
      >
        {renderForm}
      </Formik>
    </PageWrap>
  );
};
