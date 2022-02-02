import { Fragment, useMemo, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useApolloClient } from '@apollo/client';
import RefreshIcon from '@material-ui/icons/Refresh';
import { GameStatus, HistoryItemProps } from 'helpers/pl-types';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { setStoreProperty as setSessionStoreProperty } from 'redux/slices/session-slice';
import storage, { LAST_BET_TIME } from 'helpers/storage';
import { HistoryStatus } from 'components/history-status';
import { LetterAvatar } from 'components/letter-avatar';
import BetConfirmation from 'components/bet-confirmation';
import { submitBet } from 'redux/actions/lobby-actions';
import useChannels from 'hooks/use-channels';
import BetConfirmedAlert from './bet-confirmed-alert';
import buildHistory from './helpers';
import PerformanceStats from './performance-stats';
import { BetItem } from './bet-item';
import { TotalReturns } from './total-returns';
import {
  HeaderWrapper,
  TeamsWrapper,
  Teammate,
  ContentWrapper,
  ItemsContainer,
  Separator,
  HeaderText,
  SecondaryText,
  HeaderInnerWrapper,
  HeaderBottomSection,
  HeaderTopSection,
  Ids,
  BottomBar,
  BetButton,
  RememberBetButton,
} from './history-details.styles';

const HistoryDetails = (props: HistoryItemProps): JSX.Element => {
  const {
    team,
    tasks,
    state,
    date,
    resultMatchCodId,
    gameMode: itemGameMode,
    id,
    userStats,
    lobbyStats,
  } = props;
  const {
    bets,
    pickedBets,
    isCaptain,
    teamId,
    betStatus,
    gameMode,
  } = useSelector(({ lobby }: RootState) => lobby);
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const [showConfirm, setShowConfirm] = useState(false);
  let returnAmount = 0;
  let betAmount = 0;
  const teamChannel = useChannels(`team`, teamId);
  const apollo = useApolloClient();

  const handlePlaceBet = async (): Promise<void> => {
    const resp: any = await dispatch(submitBet({ apollo }));
    if (resp.payload.betStatus === 'WAITING') {
      enqueueSnackbar(<BetConfirmedAlert message="Bet confirmed" />, {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
      const builtData = buildHistory([resp.payload.betHistory]);
      await dispatch(setStoreProperty(['openHistoryModal', true]));
      dispatch(setStoreProperty(['openDetails', builtData[0]]));
      teamChannel?.push('update', { betStatus, event: 'update' });
      const newUserWithBalance = { ...currentUser, wallet: { funds: resp.payload.newBalance } };
      dispatch(setSessionStoreProperty(['currentUser', newUserWithBalance]));
    }
  };

  const runBetAgain = (): void => {
    const lastTime = storage.get(LAST_BET_TIME) || 0;
    if (moment(+lastTime).add(1, 'm') <= moment()) {
      storage.remove(LAST_BET_TIME);
      dispatch(setStoreProperty(['betStatus', 'OPEN']));

      const newPickedBets = { ...pickedBets };
      try {
        Object.keys(newPickedBets).forEach((key: any) => {
          const task = tasks.find((x) =>
            key === 'killsPrizes'
              ? x.type === 'KILLS'
              : x.type === key.toUpperCase(),
          );
          let level = -1;
          let value: any = 0;
          let payout = 0;

          if (task) {
            switch (key) {
              case 'main':
                bets?.main.forEach((mb: any) => {
                  if (mb.goal === task.goal && mb.payout === task.payout) {
                    level = mb.level;
                    payout = mb.payout;
                    value = mb.goal;
                  }
                });
                break;
              case 'killsPrizes':
                bets?.kills.forEach((mb: any) => {
                  if (mb.goal === task.goal && mb.payout === task.payout) {
                    level = mb.level;
                    payout = mb.payout;
                    value = mb.goal;
                  }
                });

                break;
              case 'damage':
                bets?.damage.forEach((mb: any) => {
                  if (mb.goal === task.goal && mb.payout === task.payout) {
                    level = mb.level;
                    payout = mb.payout;
                    value = mb.goal;
                  }
                });
                break;
              case 'placement':
                bets?.placement.forEach((mb: any) => {
                  if (mb.goal === task.goal && mb.payout === task.payout) {
                    level = mb.level;
                    payout = mb.payout;
                    value = mb.goal;
                  }
                });
                break;
              case 'match':
                bets?.match.forEach((mb: any) => {
                  if (mb.goal === task.goal && mb.payout === task.payout) {
                    level = mb.level;
                    payout = mb.payout;
                    value = 'Finish 1st';
                  }
                });
                break;
              default:
                break;
            }
          }
          if (level !== -1 && payout && value) {
            newPickedBets[key] = { checked: true, level, value, payout };
          } else {
            newPickedBets[key] = {
              ...newPickedBets[key],
              checked: false,
            };
          }
        }, {});
        if (newPickedBets.main) {
          dispatch(setStoreProperty(['pickedBets', newPickedBets]));
          dispatch(setStoreProperty(['openHistoryModal', false]));
          handlePlaceBet();
        } else {
          enqueueSnackbar("Current bet is no longer available", {
            variant: 'error',
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
          });
        }
      } catch (err) {
        enqueueSnackbar("Can't set the same bet to the available values", {
          variant: 'error',
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      }
    } else {
      enqueueSnackbar('You can not place another bet yet', {
        variant: 'error',
      });
    }
  };

  const handleCancel = (): void => {
    setShowConfirm(false);
  };

  const handleConfirm = (): void => {
    setShowConfirm(false);
    runBetAgain();
  };

  const teamStyle = { width: 64, height: 64, border: '2px solid white', marginBottom: '8px' };

  const Header = (): JSX.Element => (
    <HeaderWrapper>
      <HeaderTopSection>
        <HeaderText>Bet placed</HeaderText>
        <HistoryStatus {...props} />
      </HeaderTopSection>

      <HeaderInnerWrapper>
      <SecondaryText>{moment.utc(date).local().format('hh:mm a MMM Do YYYY')}</SecondaryText>
        <SecondaryText>
          {(state === GameStatus.WAITING
            ? 'ETA to resolution '
            : 'Results Finalized') +
            (state === GameStatus.WAITING
              ? moment.utc(date).local().add(40, 'minutes').format('hh:mm a')
              : '')}
        </SecondaryText>
      </HeaderInnerWrapper>

      <HeaderBottomSection>
        <Ids>{id ? `Bet #: ${id}` : ''}</Ids>
        <Ids>{resultMatchCodId ? `Match ID: ${resultMatchCodId}` : ''}</Ids>
      </HeaderBottomSection>
    </HeaderWrapper>
  );

  const returns = useMemo(() => {
    tasks.forEach((m) => {
      if (m.won || state === GameStatus.WAITING) returnAmount += m.returnAmount;
      betAmount += m.betAmount;
    });
    return {
      betAmount,
      returnAmount,
      title: 'Total bets (per player)',
      subtitle: 'Total winnings (per player)',
      state,
    };
  }, [tasks]);

  const checkTimePastFromLastBet = (hideAlert?: boolean): void => {
    const lastTime = storage.get(LAST_BET_TIME) || 0;
    if (moment(+lastTime).add(1, 'm') <= moment()) {
      storage.remove(LAST_BET_TIME);
      dispatch(setStoreProperty(['betStatus', 'OPEN']));
      if (!hideAlert) {
        enqueueSnackbar('You can now place a new bet', {
          variant: 'success',
          anchorOrigin: { horizontal: 'center', vertical: 'top' },
        });
      }
    } else if (!hideAlert) {
      enqueueSnackbar('You can not place another bet yet', {
        variant: 'error',
      });
    }
  };

  const displayUseSameBetButton = isCaptain && teamId && gameMode === itemGameMode && !currentUser.privateProfile;

  return (
    <>
      <ContentWrapper>
        <Header />
        <TeamsWrapper>
          {team?.map((tm) => (
            <Teammate id={`${tm.name}history_details`} key={`${tm.name}player`}>
              <LetterAvatar
                name={tm.name}
                style={teamStyle}
                key={`${tm.name}detail`}
              />
              <HeaderText>{tm.name}</HeaderText>
            </Teammate>
          ))}
        </TeamsWrapper>
        <ItemsContainer>
          {tasks.map((b, i) => (
            <Fragment key={`${b.id}task`}>
              <BetItem {...b} id={b.title} state={state} />
              {i < tasks.length - 1 && <Separator />}
            </Fragment>
          ))}
        </ItemsContainer>
        <PerformanceStats rows={userStats} lobbyStats={lobbyStats} />
      </ContentWrapper>

      <BottomBar variant="dark">
        <TotalReturns {...returns} />
        {displayUseSameBetButton && (
          <>
            {betStatus === 'OPEN' ? (
              <BetButton
                variant="success"
                tabIndex={0}
                onClick={() => setShowConfirm(true)}
                onKeyPress={() => setShowConfirm(true)}
              >
                Use same bet
              </BetButton>
            ) : (
              <RememberBetButton
                role="button"
                variant="info"
                tabIndex={0}
                onClick={() => checkTimePastFromLastBet(false)}
                onKeyPress={() => checkTimePastFromLastBet(false)}
              >
               <RefreshIcon />
                Remember to play your match
              </RememberBetButton>
            )}
          </>
        )}
      </BottomBar>

      <BetConfirmation
        onConfirm={handleConfirm}
        betAmount={returns.betAmount}
        onCancel={handleCancel}
        show={showConfirm}
        payout={returns.returnAmount?.toFixed(2)}
        teamSize={team.length}
        gameMode={gameMode}
      />
    </>
  );
};

export default HistoryDetails;
