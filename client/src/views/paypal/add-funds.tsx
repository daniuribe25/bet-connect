import { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
  createStyles,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/client';
import ModalHeader from 'components/core/modal-header';
import { useHistory } from 'react-router-dom';
import { setTimeout } from 'timers';
import { RootState } from 'redux/root-reducer';
import { addFunds, loadUser } from 'redux/actions/session-actions';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { setStoreProperty as setLobbyStoreProperty } from 'redux/slices/session-slice';
import Loading from 'components/loading';
import storage, { NUM_PAYMENTS, VERIFYING_AGE } from 'helpers/storage';
import { getBetHistory } from 'redux/actions/lobby-actions';
import {
  trackDepositCompleted,
  trackDepositStarted,
} from 'helpers/segment-analytics';
import BerbixModal from '../berbix/berbix-modal';
import SuggestedFundsCard from './suggested-funds-card';
import {
  PageWrapper,
  BottomSheet,
  DollarSign,
  SuggestedValuesWrapper,
  ContentWrapper,
} from './add-funds.styles';

const useStyles = makeStyles(() =>
  createStyles({
    inputCont: {
      marginBottom: '1rem',
      padding: '0 1rem',
    },
    amountInput: {
      borderBottom: '2px solid #2F9BD8',
      color: 'white',
      textAlign: 'right',
      fontSize: 40,
      fontWeight: 900,
      padding: 4,
    },
    paypalCover: {
      position: 'absolute',
      width: '100%',
      height: '65px',
      zIndex: 999,
      bottom: 0,
      opacity: 0.3,
      background: 'aliceblue',
    },
  }),
);

declare const paypal: any;
const MAX_PAYMENTS = 5;
const MAX_GAMES = 10;

const suggestedValues = [
  { value: 25 },
  { value: 50, popular: true },
  { value: 100 },
  { value: 250 },
];

const AddFunds: FunctionComponent = () => {
  const css = useStyles({});
  const dispatch = useDispatch();
  const history = useHistory();
  const [amountToAdd, setAmountToAdd] = useState(50);
  const { currentUser, loading } = useSelector(
    ({ session }: RootState) => session,
  );
  const { teamUsers, teamId, isCaptain, userBetHistory } = useSelector(
    ({ lobby }: RootState) => lobby,
  );
  const apollo = useApolloClient();
  const buttonRef = useRef<any>();
  const np = storage.get(NUM_PAYMENTS) || '0';

  const gamesPlayed = userBetHistory.filter((bh) => bh.status === 'COMPLETE')
    .length;

  useEffect(() => {
    dispatch(getBetHistory({ apollo }));
    trackDepositStarted('bottom_nav');
  }, []);

  const handleClose = (): void => {
    dispatch(setStoreProperty(['openTeamModal', false]));
    if (teamId && isCaptain) history.push('/bet');
    else if (teamId && !isCaptain) history.push('/activeBet');
    else history.push('/bet');
  };

  const createOrder = (_: any, actions: any): any => {
    return actions.order.create({
      intent: 'authorize',
      purchase_units: [{ amount: { value: amountToAdd } }],
    });
  };

  const onApprove = (data: any, actions: any): any => {
    // Authorize the transaction
    actions.order.authorize().then(async (authorization: any) => {
      const authorizationId =
        authorization.purchase_units[0].payments.authorizations[0].id;
      trackDepositCompleted(amountToAdd);
      const resp: any = await dispatch(
        addFunds({
          apollo,
          userId: currentUser.id,
          authorizationId,
          orderId: data.orderID,
          funds: amountToAdd,
        }),
      );
      if (resp.payload.wallet) {
        storage.save(NUM_PAYMENTS, (+np + 1).toString());
        dispatch(setStoreProperty(['alerts', resp.payload.alerts]));
        const newUsers = [...teamUsers].map((x: any) => {
          if (!x || x.userId !== currentUser.id) return x;
          return { ...x, user: { ...x.user, wallet: resp.payload.wallet } };
        });
        dispatch(setStoreProperty(['teamUsers', newUsers]));
        handleClose();
      }
    });
  };

  const handleChangeAmount = (e: any): void => setAmountToAdd(+e.target.value);

  const renderPaypalButton = (amount: number): void => {
    const cont = document.getElementById('paypal-integration');
    if (cont) cont.innerHTML = '';
    // @ts-ignore
    if (buttonRef?.current && paypal !== undefined) {
      paypal
        .Buttons({
          onInit: (_: any, actions: any) => {
            if (amount < 10) actions.disable();
            else actions.enable();
          },
          commit: false,
          createOrder,
          onApprove,
          style: { shape: 'pill' },
          enableStandardCardFields: true,
        })
        .render('#paypal-integration');
    }
  };

  useEffect(() => {
    // @ts-ignore
    if (typeof paypal !== 'undefined' && paypal) {
      renderPaypalButton(+amountToAdd);
    } else {
      setTimeout(() => {
        if (typeof paypal !== 'undefined' && paypal)
          renderPaypalButton(+amountToAdd);
      }, 2000);
    }
  }, [amountToAdd]);

  useEffect(() => {
    dispatch(setLobbyStoreProperty(['loading', false]));
    if (currentUser.privateProfile) handleClose();
    dispatch(loadUser({ apollo }));
  }, []);

  useEffect(() => {
    if (currentUser.ageVerified) {
      storage.remove(VERIFYING_AGE);
    }
  }, [currentUser.ageVerified]);
  const canPay =
    currentUser.ageVerified || (gamesPlayed < MAX_GAMES && +np < MAX_PAYMENTS);

  return (
    <PageWrapper>
      <Loading show={loading} />
      <ModalHeader
        title={canPay ? 'Add funds' : 'Verify your age'}
        backOnClick={handleClose}
      />
      {canPay ? (
        <ContentWrapper>
          <SuggestedValuesWrapper>
            {suggestedValues.map((s) => (
              <SuggestedFundsCard
                key={s.value}
                value={s.value}
                popular={s.popular}
                // eslint-disable-next-line eqeqeq
                selected={amountToAdd == s.value}
                onChange={(value: number) => setAmountToAdd(value)}
              />
            ))}
          </SuggestedValuesWrapper>
          <BottomSheet>
            <TextField
              autoComplete="on"
              type="number"
              name="amount"
              fullWidth
              className={css.inputCont}
              inputProps={{ className: css.amountInput, lang: 'en-US' }}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              InputProps={{
                startAdornment: (
                  <DollarSign>$</DollarSign>
                ),
              }}
              onChange={handleChangeAmount}
              value={(+amountToAdd).toFixed(2)}
              error={+amountToAdd < 10}
              helperText={+amountToAdd < 10 && 'Minimum amount to add is $10'}
            />
            <div>
              {+amountToAdd < 10 && <div className={css.paypalCover} />}
              <div id="paypal-integration" ref={buttonRef} />
            </div>
          </BottomSheet>
        </ContentWrapper>
      ) : (
        <BerbixModal />
      )}
    </PageWrapper>
  );
};

export default AddFunds;
