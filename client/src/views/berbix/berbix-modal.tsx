import { FunctionComponent, useState } from 'react';
import { useMutation } from '@apollo/client';
import BerbixVerify from 'berbix-react';
import Pill from 'components/core/pill';
import { createStyles, makeStyles, Modal } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { RootState } from 'redux/root-reducer';
import createBerbixToken from 'api/gql/mutations/berbix-mutations';
import storage, { VERIFYING_AGE } from 'helpers/storage';
import { trackBerbixVerificationStarted } from 'helpers/segment-analytics';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: '5rem 2rem',
    },
    berbixModal: {
      padding: '5%',
      maxWidth: '600px',
      display: 'flex',
    },
    verifyingAgeText: {
      color: 'gray',
      fontSize: '20px',
      alignSelf: 'center',
      marginTop: '5rem',
      textAlign: 'center',
    },
  }),
);

export const BerbixComponent: FunctionComponent<any> = (props: any) => {
  const {
    displayValidation,
    handleDisplayValidation,
    token,
    onComplete,
  } = props;
  const styles = useStyles({});

  return (
    <Modal
      className={styles.berbixModal}
      open={displayValidation}
      onClose={handleDisplayValidation}
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
    >
      <BerbixVerify
        clientToken={token}
        showInModal
        showCloseModalButton
        onCloseModal={handleDisplayValidation}
        onComplete={onComplete}
      />
    </Modal>
  );
};

const BerbixModal: FunctionComponent = () => {
  const styles = useStyles({});
  const [state, setState] = useState({ displayValidation: false, token: null });
  const { displayValidation, token } = state;
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const { teamId, isCaptain } = useSelector(({ lobby }: RootState) => lobby);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const verifyingAge = storage.get(VERIFYING_AGE) === 'true';

  const handleComplete = (): void => {
    storage.save(VERIFYING_AGE, 'true');
    enqueueSnackbar(
      'we are verifying your age, please try accesing again in a minute',
      { variant: 'success' },
    );
    if (teamId && isCaptain) history.push('/bet');
    else if (teamId && !isCaptain) history.push('/activeBet');
    else history.push('/bet');
  };

  const [createBerbixTokenMutation] = useMutation(createBerbixToken, {
    variables: {
      // The variable token is necessary to be send as a random string because as the resolver is created with ash is mandatory to send something but is not used
      input: { token: '123123', userId: currentUser.id || '' },
    },
    onCompleted: (data) => {
      setState({ ...state, token: data?.createBerbixToken?.result?.token });
    },
  });

  const handleDisplayValidation = (): void => {
    trackBerbixVerificationStarted();
    createBerbixTokenMutation();
    setState({ ...state, displayValidation: !displayValidation });
  };

  return (
    <>
      <div className={styles.root}>
        {!verifyingAge ? (
          <Pill variant="success" onClick={handleDisplayValidation}>Verify</Pill>
        ) : (
          <div className={styles.verifyingAgeText}>
            <span>
              We are verifying your age, please try to access later or contact
              an admin through support option
            </span>
          </div>
        )}
      </div>
      {token && typeof token === 'string' && (
        <BerbixComponent
          handleDisplayValidation={handleDisplayValidation}
          token={token}
          displayValidation={displayValidation}
          onComplete={handleComplete}
        />
      )}
    </>
  );
};

export default BerbixModal;
