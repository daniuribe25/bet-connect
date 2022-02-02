import { useMemo, useEffect, useState, FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { ModalContext } from 'util/modal-context/modal-context';
import Pill from 'components/core/pill';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/client';
import moment from 'moment';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ToastContext } from 'util/toast-context/toast-context';
import useAlerts from 'hooks/use-alerts';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { setStoreProperty as setSessionStoreProperty } from 'redux/slices/session-slice';
import HistoryDetails from 'views/activity/history-details';
import {
  getBetHistory,
  getTeams,
  loadStep,
  submitBet,
} from 'redux/actions/lobby-actions';
import { RootState } from 'redux/root-reducer';
import storage, { LAST_BET_TIME } from 'helpers/storage';
import { useBetTasksStyles } from 'styles/index';
import { getBetAnte } from 'helpers/common';
import useChannels from 'hooks/use-channels';
import BetConfirmation from 'components/bet-confirmation';
import AvailablePlayersModal from 'components/add-players/available-players-modal';
import buildHistory from 'views/activity/helpers';

const MainButton = styled(Pill)`
  margin-top: 16px;
`;

const BetGame: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const toastContext = useContext(ToastContext)
  const [lastBetInterval, setLastBetInterval] = useState<any>(0);
  const apollo = useApolloClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const context = useContext(ModalContext);

  const {
    pickedBets,
    alerts,
    pickedCategory,
    betStatus,
    gameMode,
    teamId,
    bets,
    featureFlags,
    squadSize,
  } = useSelector(({ lobby }: RootState) => lobby);
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const styles = useBetTasksStyles({ noStats: currentUser.privateProfile });
  const teamChannel = useChannels(`team`, teamId);
  useAlerts(alerts, setStoreProperty);

  const { ante, payout } = useMemo(() => {
    return Object.entries(pickedBets).reduce(
      (acc, [key, value]: any) => {
        if (!value.checked) return acc;
        return {
          ante:
            acc.ante +
            (key === 'main'
              ? getBetAnte(pickedCategory, true)
              : getBetAnte(pickedCategory, false)),
          payout: +acc.payout + +value.payout,
        };
      },
      { ante: 0, payout: 0 },
    );
  }, [pickedBets]);

  const handleSetReportView = (): void => {
    setShowConfirm(true);
  };

  const checkTimePastFromLastBet = (hideAlert?: boolean): void | undefined => {
    const lastTime = storage.get(LAST_BET_TIME) || 0;
    if (!lastTime) {
      dispatch(setStoreProperty(['betStatus', 'OPEN']));
      return;
    }

    if (lastTime && moment(+lastTime).add(1, 'm') <= moment()) {
      storage.remove(LAST_BET_TIME);
      dispatch(getTeams({ apollo, currentUser }));
      dispatch(loadStep({ apollo }));
      dispatch(setStoreProperty(['betStatus', 'OPEN']));
      if (!hideAlert) {
        toastContext?.displayToast({
          toastDisplayed: true,
          type: 'success',
          subtext: 'You can now place a new bet',
        });
      }
    } else if (!hideAlert) {
      toastContext?.displayToast({
        toastDisplayed: true,
        type: 'warning',
        subtext: 'You can not place another bet yet',
      });
    }
  };

  // eslint-disable-next-line no-shadow
  const updateTeamBet = (updatedBets: any, bets: any): void => {
    teamChannel
      ?.push('update', {
        event: 'update',
        betStatus,
        pickedBets: updatedBets,
        bets,
        gameMode,
      })
      .receive('error', (reasons: any) =>
        // eslint-disable-next-line no-console
        console.log('create failed', reasons),
      );
  };

  useEffect(() => {
    dispatch(getBetHistory({ apollo }));
    dispatch(getTeams({ apollo, currentUser }));
    dispatch(loadStep({ apollo }));
    setTimeout(() => checkTimePastFromLastBet(true), 1000);
  }, [getBetHistory]);

  useEffect(() => {
    clearInterval(lastBetInterval);
    checkTimePastFromLastBet(true);
    setLastBetInterval(
      setInterval(() => checkTimePastFromLastBet(true), 10000),
    );
  }, [betStatus]);

  useEffect(() => {
    updateTeamBet(pickedBets, bets);
  }, [pickedBets, bets]);

  useEffect(() => {
    teamChannel?.on('update', (data: any) => {
      if (data.event === 'join') {
        updateTeamBet(pickedBets, bets);
      }
    });
  }, [teamChannel]);

  const handleCancel = (): void => {
    setShowConfirm(false);
  };

  const handlePlaceBet = async (): Promise<void> => {
    setShowConfirm(false);
    const resp: any = await dispatch(submitBet({ apollo }));
    if (resp.payload.betStatus === 'WAITING') {
      toastContext?.displayToast({
        toastDisplayed: true,
        type: 'success',
        heading: 'Bet confirmed',
        subtext: 'Have a great match!',
      });

      const builtData = buildHistory([resp.payload.betHistory]);
      context?.displayModal({
        modalDisplayed: true,
        type: 'fullscreen',
        modalTitle: builtData?.[0]?.game,
        body: <HistoryDetails {...builtData[0]} />,
      });
      teamChannel?.push('update', { betStatus, event: 'update' });
      const newUserWithBalance = { ...currentUser, wallet: { funds: resp.payload.newBalance } };
      dispatch(setSessionStoreProperty(['currentUser', newUserWithBalance]));
    }
  };

  return (
    <>
      {!currentUser.privateProfile && (
        <div className={styles.placeBetBtnRoot}>
          {betStatus === 'OPEN' ? (
            <MainButton
              variant="success"
              onClick={handleSetReportView}
              disabled={featureFlags?.STOP_BETS}
            >
              <div className={styles.betButtonTextRoot}>
                <span className={styles.betPerPersonText}>
                  {`Bet $${+ante.toFixed(2)} per person`}
                </span>
                <span className={styles.winPerPersonText}>
                  {`To win $${(ante + payout).toFixed(2)} each`}
                </span>
              </div>
            </MainButton>
          ) : (
            <div
              className={styles.placeBetDisabled}
              tabIndex={0}
              role="button"
              onClick={() => checkTimePastFromLastBet(false)}
              onKeyPress={() => checkTimePastFromLastBet(false)}
            >
              <RefreshIcon className={styles.refreshIcon} />
              Remember to play your match
            </div>
          )}
        </div>
      )}
      <BetConfirmation
        onConfirm={handlePlaceBet}
        betAmount={ante}
        onCancel={handleCancel}
        show={showConfirm}
        payout={(ante + payout).toFixed(2)}
        teamSize={squadSize}
        gameMode={gameMode}
      />
      <AvailablePlayersModal teamChannel={teamChannel} />
    </>
  );
};

export default BetGame;
