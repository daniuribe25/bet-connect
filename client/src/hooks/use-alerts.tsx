import { createStyles, makeStyles } from '@material-ui/core';
import DismissButton from 'components/dismiss-button';
import { SnackbarMessage, useSnackbar } from 'notistack';
import { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { errorTranslator } from '../helpers/common';

export const SNACK_CLOSE_TIMEOUT = 5000;

export const defaultTitles: any = {
  error: 'Error',
  success: 'Success',
};

export const hiddenErrorMessages = [
  'Received status code 500',
  'parse response',
];

const useStyles = makeStyles(() =>
  createStyles({
    alertRoot: {
      display: 'flex',
      flexDirection: 'column',
      color: '#FFFFFF',
    },
    alertTitle: {
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '3px',
    },
    alertSubtitle: {
      fontSize: '12px',
      margin: '5px 0 10px 0',
    },
    alertDismiss: {
      border: '1px solid #FFFFFF',
      borderRadius: '15px',
      padding: '2px 15px',
      width: '6rem',
      textAlign: 'center',
    },
    errorAlertRoot: {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      padding: '1rem',
      zIndex: 1401
    },
    errorAlertCont: {
      backgroundColor: '#d32f2f',
      borderRadius: '5px',
      padding: '0.5rem 1rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      color: '#FFFFFF',
      width: '100%',
    },
    errorAlertSubtitle: {
      fontSize: '14px',
      margin: '5px 0 10px 0',
    },
    errorAlertDismiss: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
  }),
);

const BetConfirmedAlert: FunctionComponent<{
  title?: string;
  message: SnackbarMessage;
}> = ({ title, message }: { title?: string; message: SnackbarMessage }) => {
  const styles = useStyles({});
  return (
    <div className={styles.alertRoot}>
      <span className={styles.alertTitle}>{title}</span>
      <span className={styles.alertSubtitle}>{message}</span>
    </div>
  );
};

export const ErrorAlert: FunctionComponent<{
  show: boolean;
  title?: string;
  message: SnackbarMessage;
}> = ({ title, message, show }: { title?: string; message: SnackbarMessage, show: boolean }) => {
  const [hide, setHide] = useState(!show);

  useEffect(() => {
    setHide(!show);
  }, [show]);

  const styles = useStyles({});
  return !hide ? (
    <div className={styles.errorAlertRoot}>
      <div className={styles.errorAlertCont}>
        <span className={styles.alertTitle}>{title}</span>
        <span className={styles.errorAlertSubtitle}>{message}</span>
        <div className={styles.errorAlertDismiss}>
          <DismissButton id={1} onClick={() => setHide(true)} />
        </div>
      </div>
    </div>
  ) : null;
};

const useAlerts = (
  alerts: any,
  setStoreProperty: (keyValue: [string, any]) => any,
): null => {
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (alerts?.messages?.length) {
      alerts.messages.forEach((message: any) => {
        if (
          message.text !== 'is required' &&
          !hiddenErrorMessages.some((m) => message.text.includes(m))
        ) {
          const key = enqueueSnackbar(
            <BetConfirmedAlert
              message={errorTranslator(message.text)}
              title={message.title || defaultTitles[message.type]}
            />,
            {
              variant: message.type,
              anchorOrigin: { vertical: 'top', horizontal: 'center' },
              persist: true,
              autoHideDuration: 8000,
            },
          );
          setTimeout(() => {
            closeSnackbar(key);
          }, SNACK_CLOSE_TIMEOUT);
        }
      });

      // handleMessages(enqueueSnackbar, alerts);
    }
    dispatch(setStoreProperty(['alerts', { ...alerts, messages: [] }]));
  }, [alerts?.id]);

  return null;
};
export default useAlerts;
