/* eslint-disable no-nested-ternary */
import { FunctionComponent, useState } from 'react';
import 'react-phone-input-2/lib/style.css';
import {
  createStyles,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router';
import Pill from 'components/core/pill'
import psnIcon from 'assets/images/psn_icon_white.svg';
import xblIcon from 'assets/images/xbox_icon_white.svg';
import battlenetIcon from 'assets/images/pc_icon_white.svg';
import psnBlueIcon from 'assets/images/psn_icon_blue.svg';
import xblBlueIcon from 'assets/images/xbox_icon_blue.svg';
import battlenetBlueIcon from 'assets/images/pc_icon_blue.svg';
import { setStoreProperty } from 'redux/slices/session-slice';
import { SignupSteps } from 'helpers/pl-types';
import { registerUserbyStep } from 'redux/actions/session-actions';
import { updateGamerTagsMutation as updateGamerTags } from 'api/gql/mutations/create-user-by-phone';
import { RootState } from 'redux/root-reducer';
import { trackGamertagEntered } from 'helpers/segment-analytics';
import { getUserPlatform } from 'helpers/common';
import updateProfileStatus from 'api/gql/mutations/confirm-private-profile';
import { useLoginStyles } from 'styles/index';
import SignupProgressBar from './signup-progress-bar';
import {
  PageWrap,
  ContentWrap,
  IconWrapper,
  Heading,
  Info,
  BottomWrap,
} from './components';

const platformColors = {
  XBL: '#107C10',
  PSN: '#0070D1',
  BATTLENET: '#104A77',
};

const gamerTagValues: {[key: string]: { label: string, platform: string, icon: any, inputIcon: any }} = {
  XBL: { label: "Xbox Live gamertag", platform: 'xbl', icon: xblIcon, inputIcon: xblBlueIcon },
  PSN: { label: "PlayStation Network ID", platform: 'psn', icon: psnIcon, inputIcon: psnBlueIcon },
  BATTLENET: { label: "Battle.net battletag", platform: 'battlenet', icon: battlenetIcon, inputIcon: battlenetBlueIcon },
}

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}

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
    platformsTiles: {
      margin: '0',
      marginBottom: '22px',
      display: 'flex',
      '& :first-child': {
        marginLeft: 0,
      },
      '& :last-child': {
        marginRight: 0,
      },
    },
    tileRoot: ({ selected, platform }: any) => ({
      display: 'flex',
      position: 'relative',
      backgroundColor:
        (selected && platform && getProperty(platformColors, platform)) ||
        'transparent',
      margin: '0 4px',
      borderRadius: '4px',
      cursor: 'pointer',
      height: '85px',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      border: selected ? '1px solid transparent' : '1px solid #3F7193',
    }),
    tileImage: ({ platform }) => ({
      width: platform === 'XBL' ? 39 : 48,
    }),
    inputGamertagCont: {
      margin: '4px 0 !important',
      '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
        color: '#2F9BD8',
      },
      '& .Mui-error': {
        '& .MuiInputBase-input': {
          borderWidth: '0px'
        },
      },
      '& .MuiFormLabel-root': {
        left: '50px !important',
      },
      '& p': {
        color: 'white',
      },
    },
    highlightedText: {
      color: '#f6bb43',
      fontWeight: 700,
    },
    inputGamertag: {
      padding: '27px 0 !important',
      paddingLeft: '0rem !important',
    },
    inputIcon: {
      position: 'relative',
      top: '-8px',
      left: '20px',
      zIndex: 3,
    },
    nextBtnCont: ({ isKeyboardOpen }: any) => ({
      marginTop: '2rem',
      position: !isKeyboardOpen ? 'absolute' : 'relative',
      bottom: 10,
      width: !isKeyboardOpen ? '90%' : '100%',
    }),
    nextBtn: {
      '& span': {
        fontSize: '26px',
      },
    },
    backButton: {
      color: '#3F7193 !important',
      position: 'relative',
      padding: '0',
    },
    linkText: {
      fontSize: '16px !important',
      color: '#2F9BD8',
      textAlign: 'center',
      marginTop: '0.8rem',
      cursor: 'pointer'
    }
  }),
);

const GamerTagTile: FunctionComponent<{
  icon: string;
  onSelect: CallableFunction;
  platform: string;
  selected: boolean;
}> = ({ icon, onSelect, platform, selected }: any) => {
  const styles = useStyles({ selected, platform });

  const handleSelect = (): void => onSelect(platform);

  return (
    <div
      className={styles.tileRoot}
      onClick={handleSelect}
      onKeyPress={handleSelect}
      tabIndex={0}
      role="button"
    >
      <img src={icon} alt="icon" className={styles.tileImage} />
    </div>
  );
};

// eslint-disable-next-line import/prefer-default-export
export const GamerTagStep: FunctionComponent<any> = ({ fromNoStats }: any) => {
  const { userToSignup, currentUser } = useSelector(
    ({ session }: RootState) => session,
  );
  const [selected, setSelected] = useState<string>('');
  const [gamertag, setGamertag] = useState(
      getUserPlatform(userToSignup).username ||
      getUserPlatform(currentUser).username
  );
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [inputError, setInputError] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const styles = useStyles({ selected: null, isKeyboardOpen });
  const loginStyles = useLoginStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [updateGamerTagsMutation] = useMutation(updateGamerTags);
  const [confirmPrivateProfileMutation] = useMutation(updateProfileStatus);

  const handleSelect = (platform: string): void => {
    setInputError('');
    setSelected(platform);
  }
  const handleInputChange = (e: any): void => {
    setInputError('');
    setGamertag(e.target.value);
  }

  const handleGoBack = (): void => {
    if (!fromNoStats) {
      dispatch(setStoreProperty(['signupStep', SignupSteps.phoneVerification]));
    } else {
      history.push('/noStats');
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setInputError('');
    if (!selected) {
      enqueueSnackbar('You have to select one of the available platforms', {
        variant: 'error',
      });
      return;
    }
    if (selected && !gamertag) {
      enqueueSnackbar('Invalid gamertag', { variant: 'error' });
      return;
    }
    if (selected === 'BATTLENET' && !gamertag.includes('#')) {
      setInputError('Must include your battletag number: gamertag#1234');
      return;
    }

    const values: any = {};
    Object.entries(gamerTagValues).forEach((val: any): any => {
      values[`${val[0].toLowerCase()}PlatformUsername`] = val[0] === selected ? gamertag : ''
    }, {} as any);
    trackGamertagEntered(selected, gamertag);
    const resp: any = await dispatch(
      registerUserbyStep({
        updateGamerTagsMutation,
        step: SignupSteps.gamerTag,
        values,
        fromBack: userToSignup.stepRegister === 'STEP_3',
      }),
    );
    if (fromNoStats && resp.payload?.user) {
      const updatedCurrentUser = {
        ...currentUser,
        [`${selected.toLowerCase()}PlatformUsername`]: gamertag,
      };
      dispatch(setStoreProperty(['currentUser', updatedCurrentUser]));
      dispatch(
        registerUserbyStep({
          confirmPrivateProfileMutation,
          step: SignupSteps.settings,
        }),
      );
      history.push('/bet');
    }
  };

  const handleWhereIsMyId = (): void => {
    history.push('/faq');
  }

  return (
    <PageWrap>
      <ContentWrap isKeyboardOpen={isKeyboardOpen}>
        {!fromNoStats && (
          <IconWrapper>
            <IconButton
              className={styles.backButton}
              component="span"
              onClick={handleGoBack}
            >
              <ArrowBackIosIcon />
            </IconButton>
          </IconWrapper>
        )}
        <Heading>Add a gamertag</Heading>
        <Info>
          Gamertags are{' '}
          <span className={styles.highlightedText}>case-sensitive</span>, please
          type them exactly as they appear on your console.
        </Info>

        <div className={styles.platformsTiles}>
          {Object.entries(gamerTagValues).map((gt: any) => (
            <GamerTagTile
              key={gt[1].platform}
              icon={gt[1].icon}
              onSelect={handleSelect}
              platform={gt[1].platform.toUpperCase()}
              selected={selected === gt[1].platform.toUpperCase()}
            />
          ))}
        </div>

        {selected && (
          <TextField
            label={gamerTagValues[selected].label}
            variant="filled"
            name={`${selected.toLowerCase()}_platform_username`}
            fullWidth
            className={`${loginStyles.inputCont} ${styles.inputGamertagCont}`}
            InputProps={{
              className: `${loginStyles.input} ${styles.inputGamertag}`,
              startAdornment: (
                <InputAdornment position="start">
                  <img
                    src={gamerTagValues[selected].inputIcon}
                    alt={`${selected} Icon`}
                    width={selected === 'PSN' ? 30 : 27}
                    className={styles.inputIcon}
                  />
                </InputAdornment>
              ),
              onFocus: () => setIsKeyboardOpen(true),
              onBlur: () => setTimeout(() => setIsKeyboardOpen(false), 100),
            }}
            onChange={handleInputChange}
            value={gamertag}
            error={Boolean(inputError) && true}
            helperText={inputError || "Case sensitive gamertag"}
          />
        )}
        {selected === 'BATTLENET' && (
          <span
            onClick={handleWhereIsMyId}
            onKeyPress={handleWhereIsMyId}
            tabIndex={-1}
            role="button"
            className={styles.linkText}
          >
            Where is my Battle.net ID?
          </span>
        )}
      </ContentWrap>
      <BottomWrap>
        <SignupProgressBar step={2} />
        <div
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            // className={styles.nextBtnCont}
          }}
        >
          <Pill variant="info" onClick={handleSubmit}>
            Confirm
          </Pill>
        </div>
      </BottomWrap>
    </PageWrap>
  );
};
