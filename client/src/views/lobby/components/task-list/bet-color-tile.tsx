import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { useBetTasksStyles } from 'styles/index';

interface BetTileProps {
  amount: string;
  payout: number;
  type: string;
  ante: number;
  anteColor: string;
}

export const BetColorTile: FunctionComponent<BetTileProps> = (
  props: BetTileProps,
) => {
  const { amount, payout, type, ante, anteColor } = props;
  const dispatch = useDispatch();
  const { pickedBets, isCaptain } = useSelector(
    ({ lobby }: RootState) => lobby,
  );
  const checked = pickedBets[type]?.checked;
  const styles = useBetTasksStyles({ checked, anteColor, type });

  const handleCheck = (): void | undefined => {
    if (!isCaptain) return;
    const updatedBets = {
      ...pickedBets,
      [type]: {
        ...pickedBets[type],
        checked: !checked,
        value: amount,
        payout,
        level: pickedBets.main?.level,
      },
    };
    dispatch(setStoreProperty(['pickedBets', updatedBets]));
  };

  return checked ? (
    <div
      className={styles.grandBetsBtnChecked}
      onClick={handleCheck}
      onKeyPress={handleCheck}
      tabIndex={0}
      role="button"
    >
      <span className={`${styles.tileGoalText} ${styles.grandBetsBtnText}`}>
        {amount}
      </span>
      <div className={styles.flex}>
        <span className={`${styles.tilePayoutText} ${styles.grandBetsBtnText}`}>
          {`WIN $${(ante + payout).toFixed(2)}`}
        </span>
      </div>
    </div>
  ) : (
    <div
      className={styles.grandBetsBtnUnchecked}
      onClick={handleCheck}
      onKeyPress={handleCheck}
      tabIndex={0}
      role="button"
    >
      <div className={styles.grandBetsBtnInner}>
        <span className={`${styles.tileGoalText} ${styles.grandBetsBtnText}`}>
          {amount}
        </span>
        <div className={styles.flex}>
          <span
            className={`${styles.tilePayoutText} ${styles.grandBetsBtnText}`}
          >
            {`WIN $${(ante + payout).toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BetColorTile;
