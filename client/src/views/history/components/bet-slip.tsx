import { useMemo, Fragment, FunctionComponent } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/client';
import { BetItem } from 'views/activity/bet-item';
import buildHistory from 'views/activity/helpers';
import { SnackbarMessage, useSnackbar } from 'notistack';
import { RootState } from '../../../redux/root-reducer';
import { getBetAnte, getPlacementSufix } from '../../../helpers/common';
import { setStoreProperty } from '../../../redux/slices/lobby-slice';
import { setStoreProperty as setSessionStoreProperty } from '../../../redux/slices/session-slice';
import { submitBet } from '../../../redux/actions/lobby-actions';
import { UserBetHistoryType } from '../../../helpers/pl-types';
import useChannels from '../../../hooks/use-channels';
import { usBetSlipStyles } from '../../../styles';

const buildData = (
  bets: any,
  pickedCategory: any,
  pickedBets: any,
  betLevels: any,
  addonAnte: number,
): Array<any> => {
  const mainBet = {
    id: 'main',
    added: pickedBets.main.checked,
    title: `Get ${
      bets[`${pickedCategory}Kills`] + pickedBets.main.level
    } kills (team total)`,
    subtitle: 'or more',
    betAmount: getBetAnte(pickedCategory, true),
    returnAmount: bets.mainPrize[pickedCategory][pickedBets.main.level],
  };
  const placeValue =
    bets.expectedPlacement.rank[
      pickedBets.placement.checked
        ? pickedBets.placement.level
        : betLevels.placementBetLevel
    ];
  const placement = {
    id: 'placement',
    added: pickedBets.placement.checked,
    title: `Place ${placeValue}${getPlacementSufix(placeValue)}`,
    subtitle: 'or better',
    betAmount: getBetAnte(pickedCategory, false),
    returnAmount:
      bets.expectedPlacement.totalPayout[pickedCategory][
        pickedBets.placement.checked ? pickedBets.placement.level : 0
      ],
  };
  const match = {
    id: 'match',
    added: pickedBets.match.checked,
    title: `Finish 1st`,
    betAmount: getBetAnte(pickedCategory, false),
    returnAmount: bets.matchPrize[pickedCategory],
  };
  const damage = {
    id: 'damage',
    added: pickedBets.damage.checked,
    title: `${
      bets.expectedDamage.rank[
        pickedBets.damage.checked
          ? pickedBets.damage.level
          : betLevels.damageBetLevel
      ]
    } damage (team total)`,
    subtitle: 'or better',
    betAmount: getBetAnte(pickedCategory, false),
    returnAmount:
      bets.expectedDamage.totalPayout[pickedCategory][
        pickedBets.damage.checked ? pickedBets.damage.level : 0
      ],
  };
  const kills = {
    id: 'killsPrizes',
    added: pickedBets.killsPrizes.checked,
    title: `${
      bets[`${pickedCategory}Kills`] + 2 + pickedBets.main.level
    } kills (team total)`,
    subtitle: 'or more',
    betAmount: getBetAnte(pickedCategory, false),
    returnAmount:
      bets.expectedKillsPrizes[pickedCategory][pickedBets.main.level] /
      addonAnte,
  };
  return [mainBet, placement, match, damage, kills];
};

type BetSlipType = {
  onBetSubmit: (item: UserBetHistoryType) => void;
};

export const BetConfirmedAlert: FunctionComponent<{
  message: SnackbarMessage;
}> = ({ message }: { message: SnackbarMessage }) => {
  const styles = usBetSlipStyles({});
  return (
    <div className={styles.alertRoot}>
      <span className={styles.alertTitle}>{message}</span>
      <span className={styles.alertSubtitle}>Have a great match!</span>
    </div>
  );
};

export const BetSlip: FunctionComponent<BetSlipType> = ({
  onBetSubmit,
}: BetSlipType) => {
  const dispatch = useDispatch();
  const apollo = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const {
    pickedBets,
    bets,
    betLevels,
    pickedCategory,
    betStatus,
    teamId,
  } = useSelector(({ lobby }: RootState) => lobby);
  const { currentUser } = useSelector(({ session }: RootState) => session);
  const css = usBetSlipStyles({ betStatus });
  const addonAnte = getBetAnte(pickedCategory, false);
  const finalData = buildData(
    bets,
    pickedCategory,
    pickedBets,
    betLevels,
    addonAnte,
  );
  const teamChannel = useChannels(`team`, teamId);

  const total = useMemo(
    () =>
      finalData.reduce(
        (acc, fb) => {
          if (!fb.added) return acc;
          return {
            bet: acc.bet + fb.betAmount,
            return: acc.return + fb.returnAmount,
          };
        },
        { bet: 0, return: 0 },
      ),
    [finalData],
  );

  const handleAddToBet = (type: string): void => {
    const checked = true;
    let level;
    let payout;
    let amount;
    // eslint-disable-next-line default-case
    switch (type) {
      case 'placement':
        level = betLevels.placementBetLevel;
        payout =
          bets.expectedPlacement.totalPayout[pickedCategory][
            betLevels.placementBetLevel
          ];
        amount = bets.expectedPlacement.rank[betLevels.placementBetLevel];
        break;
      case 'match':
        level = betLevels.mainBetLevel;
        payout = bets.matchPrize[pickedCategory];
        amount = 'Finish 1st';
        break;
      case 'damage':
        level = betLevels.damageBetLevel;
        payout =
          bets.expectedDamage.totalPayout[pickedCategory][
            betLevels.damageBetLevel
          ];
        amount = bets.expectedDamage.rank[betLevels.damageBetLevel];
        break;
      case 'killsPrizes':
        level = betLevels.damageBetLevel;
        payout =
          (bets.expectedKillsPrizes[pickedCategory][betLevels.mainBetLevel] -
            addonAnte) /
          addonAnte;
        amount = `${bets[`${pickedCategory}Kills`] + 2} kills`;
        break;
    }
    const updatedBets = {
      ...pickedBets,
      [type]: {
        ...pickedBets[type],
        checked,
        value: amount,
        payout,
        level,
      },
    };
    dispatch(setStoreProperty(['pickedBets', updatedBets]));
  };

  const handlePlaceBet = async (): Promise<void> => {
    const resp: any = await dispatch(submitBet({ apollo }));
    if (resp.payload.betStatus === 'WAITING') {
      enqueueSnackbar(<BetConfirmedAlert message="Bet confirmed" />, {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
      const builtData = buildHistory([resp.payload.betHistory]);
      onBetSubmit(builtData[0]);
      teamChannel?.push('update', { betStatus, event: 'update' });
      const newUserWithBalance = { ...currentUser, wallet: { funds: resp.payload.newBalance } };
      dispatch(setSessionStoreProperty(['currentUser', newUserWithBalance]));
    }
  };

  return (
    <div className={css.betSlip}>
      <div className={css.itemsContainer}>
        {finalData.map((b, i) => (
          <Fragment key={b.id}>
            <BetItem {...b} addToBet={handleAddToBet} />
            {i < finalData.length - 1 && <div className={css.separator} />}
          </Fragment>
        ))}
      </div>
      <div className={css.footer}>
        <div className={classnames(css.row, css.subRow)}>
          <div className={css.columnLeft}>Total bets (per player)</div>
          <div className={css.columnRight}>${total.bet.toFixed(2)}</div>
        </div>
        <div className={classnames(css.row, css.bold)}>
          <div className={css.columnLeft}>Total winnings (per player)</div>
          <div className={css.columnRight}>
            ${(total.bet + total.return).toFixed(2)}
          </div>
        </div>
        <div
          role="button"
          tabIndex={0}
          onKeyPress={betStatus === 'OPEN' ? handlePlaceBet : () => {}}
          onClick={betStatus === 'OPEN' ? handlePlaceBet : () => {}}
          className={betStatus === 'OPEN' ? css.placeBet : css.placeBetDisabled}
        >
          {betStatus === 'OPEN' ? 'Place bet' : 'Remember to play your match'}
        </div>
      </div>
    </div>
  );
};
