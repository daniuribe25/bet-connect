import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { useBetTasksStyles } from 'styles/index';
import { getPlacementSufix } from 'helpers/common';

interface BetTileProps {
  amount: number;
  payout: number;
  type: string;
  level: number;
  // eslint-disable-next-line react/no-unused-prop-types
  levels: number;
  ante: number;
  index: number;
}

// eslint-disable-next-line consistent-return
const getTaskMessage = ({ type, amount }: any): any => {
  // eslint-disable-next-line default-case
  switch (type) {
    case 'main':
    case 'damage':
      return amount;
    case 'placement':
      return `${amount}${getPlacementSufix(amount)}`;
  }
};

export const BetTile: FunctionComponent<BetTileProps> = (
  props: BetTileProps,
) => {
  const { amount, payout, type, level, ante, index } = props;
  const dispatch = useDispatch();
  const { pickedBets, betLevels, isCaptain, bets } = useSelector(
    ({ lobby }: RootState) => lobby,
  );

  const calculateChecked = (): boolean =>
    pickedBets[type].checked && pickedBets[type].value === amount;

  const checked = calculateChecked();
  const levelAvailable = true || betLevels[`${type}BetLevel`] >= level;
  const styles = useBetTasksStyles({
    checked,
    bestValue: false,
    levelAvailable,
    index,
  });

  const handleCheck = (): undefined | void => {
    if (!isCaptain) return;
    if ((checked && type === 'main') || !levelAvailable) return;
    const updatedBets = {
      ...pickedBets,
      [type]: {
        ...pickedBets[type],
        checked: !checked,
        value: amount,
        payout,
        level,
      },
    };
    if (type === 'main') {
      const killPrizes = bets?.kills?.find(
        (k: any) => k.level - 1 === level - 1,
      );
      updatedBets.killsPrizes = {
        ...updatedBets.killsPrizes,
        level,
        payout: killPrizes ? killPrizes?.payout : 0,
      };
    }
    dispatch(setStoreProperty(['pickedBets', updatedBets]));
  };

  return (
    <div
      className={styles.tileRoot}
      onClick={handleCheck}
      onKeyPress={handleCheck}
      tabIndex={0}
      role="button"
    >
      <span className={styles.tileGoalText}>
        {getTaskMessage({ type, amount })}
      </span>
      <span className={styles.tilePayoutText}>
        {`WIN $${payout && (ante + payout).toFixed(2)}`}
      </span>
    </div>
  );
};

export default BetTile;
