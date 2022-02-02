import { useEffect } from 'react';
import styled from 'styled-components';
import { Box, Button, createStyles, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router';
import { setStoreProperty } from 'redux/slices/session-slice';
import { SignupSteps } from 'helpers/pl-types';
import codSettings from 'assets/images/link-account.png';
import { RootState } from 'redux/root-reducer';
import { registerUserbyStep } from 'redux/actions/session-actions';
import updateProfileStatus from 'api/gql/mutations/confirm-private-profile';
import { trackConfirmedPublicProfile } from 'helpers/segment-analytics';
import Pill from 'components/core/pill';
import { getUserPlatform } from 'helpers/common';
import {
  PageWrap,
  ContentWrap,
  Heading,
  BottomWrap,
} from './components';

const MainButton = styled(Pill)`
  margin: 16px 0;
`;

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
        marginTop: '3px',
        marginBottom: '7px',
        fontSize: '28px',
      },
      '& span': {
        fontSize: '13px',
      },
    },
    nextBtnCont: () => ({
      marginTop: '0.5rem',
      width: '100%',
      '& span.support': {
        padding: '0.4rem',
        color: '#2F9BD8',
        fontSize: '20px',
        cursor: 'pointer',
      },
    }),
    importantText: {
      color: '#F6BB43',
    },
    list: {
      fontSize: '14px',
      padding: '0 0 0 1.5rem',

      marginTop: 0,
      '& a': {
        color: '#2F9BD8',
      },
    },
    gamerTagCont: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    noStatsLabel: {
      color: '#ffffff',
      padding: '2px 4px',
      backgroundColor: '#D82F4B',
      borderRadius: '2px',
      margin: '10px',
      fontSize: '12px !important',
    },
    gamerTag: {
      display: 'flex',
      justifyContent: 'center',
    },
    gamerTagLogoCont: ({ platform }: any) => ({
      padding: '2px',
      backgroundColor: platform === 'XBL' ? '#107C10' : '#002650',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      marginRight: '5px',
      marginBottom: '6px',
    }),
    gamerTagLogo: {},
    gamerTagText: {
      fontSize: '16px !important',
      color: '#ffffff',
    },
    gamerTagLink: {
      fontSize: '14px !important',
      color: '#2F9BD8',
    },
    nextBtn: {
      '& span': {
        fontSize: '26px',
      },
    },
    closeBtn: {
      position: 'absolute',
      right: '0px',
      top: '15px',
      '& svg': {
        color: '#3F7193',
        fontSize: '26px',
      },
    },
  }),
);

const SettingsStep = ({ fromNoStats }: any): JSX.Element => {
  const dispatch = useDispatch();
  const { userToSignup, currentUser } = useSelector(
    ({ session }: RootState) => session,
  );
  const history = useHistory();
  const styles = useStyles({
    platform: getUserPlatform(currentUser).platform,
  });
  const [confirmPrivateProfileMutation] = useMutation(updateProfileStatus);

  const handleConfirmSettings = (): void => {
    trackConfirmedPublicProfile();
    dispatch(
      registerUserbyStep({
        confirmPrivateProfileMutation,
        step: SignupSteps.settings,
      }),
    );
  };

  const handleClose = (): void => history.push('/bet');
  const handleUpdate = (): void => {
    if (!fromNoStats) {
      dispatch(setStoreProperty(['signupStep', SignupSteps.gamerTag]));
    } else {
      history.push('/updateGamerTag');
    }
  };

  useEffect(() => {
    if (fromNoStats) {
      handleConfirmSettings();
    }
  }, []);

  return (
    <PageWrap>
      {true && (
        <Button className={styles.closeBtn} onClick={handleClose}>
          <CloseIcon />
        </Button>
      )}
      <ContentWrap className={styles.root}>
        <Heading>Make COD stats public</Heading>
        <ul className={styles.list}>
          <li>We use your Call of Duty stats to confirm bet results</li>
          <li>
            Head to the{' '}
            <span className={styles.importantText}>
              <b>linked accounts</b>
            </span>{' '}
            section of{' '}
            <a href="https://callofduty.com" target="blank">
              callofduty.com
            </a>
          </li>
          <li>
            Change your account{' '}
            <span className={styles.importantText}>
              <b>Searchable</b>
            </span>{' '}
            +{' '}
            <span className={styles.importantText}>
              <b>Data Visible</b>
            </span>{' '}
            to{' '}
            <span className={styles.importantText}>
              <b>{"'ALL'"}</b>
            </span>
          </li>
        </ul>

        <Box
          mt={2}
          justifyContent="center"
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <img src={codSettings} alt="Platform linking" width="350" />
        </Box>
      </ContentWrap>
      <BottomWrap>
        <div className={styles.gamerTagCont}>
          <span className={styles.noStatsLabel}>Stats not public</span>
          <div className={styles.gamerTag}>
            <div className={styles.gamerTagLogoCont}>
              <img
                className={styles.gamerTagLogo}
                alt="gamertag logo"
                width="17"
                src={getUserPlatform(currentUser).icon}
              />
            </div>
            <span className={styles.gamerTagText}>
              {getUserPlatform(currentUser).username ||
              getUserPlatform(userToSignup).username}
            </span>
          </div>
          <span
            className={styles.gamerTagLink}
            tabIndex={0}
            role="button"
            onKeyPress={handleUpdate}
            onClick={handleUpdate}
          >
            Gamertag incorrect?
          </span>
        </div>
        <MainButton
          variant="info"
          onClick={!fromNoStats ? handleConfirmSettings : handleUpdate}
        >
          {fromNoStats ? 'Update' : 'Confirm'}
        </MainButton>
      </BottomWrap>
    </PageWrap>
  );
};

export default SettingsStep;
