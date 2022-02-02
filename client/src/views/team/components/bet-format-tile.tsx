import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { setStoreProperty } from '../../../redux/slices/lobby-slice';
import { useBetFormatTilesStyles } from '../../../styles';
import { RootState } from '../../../redux/root-reducer';

export const BetFormatTile: FunctionComponent<BetFormatTileProps> = (
  props: BetFormatTileProps,
) => {
  const { amount, addons, category, checked, levelAvailable } = props;
  const dispatch = useDispatch();
  const {
    pickedBets,
    bets,
    betLevels,
    isCaptain,
    isUpdatingTeam,
  } = useSelector(({ lobby }: RootState) => lobby);
  const styles = useBetFormatTilesStyles({ checked });

  const handleCheck = (): undefined => {
    if (!levelAvailable || !isCaptain) return;
    if (isUpdatingTeam) dispatch(setStoreProperty(['teamUpdated', true]));
    dispatch(setStoreProperty(['pickedCategory', category]));
    const updatedBets = {
      ...pickedBets,
      main: {
        ...pickedBets.main,
        checked: true,
        value: bets ? bets[`${category}Kills`] + betLevels.mainBetLevel : 0,
      },
    };
    dispatch(setStoreProperty(['pickedBets', updatedBets]));
  };
  return (
    <div
      className={styles.tileRoot}
      tabIndex={0}
      role="button"
      onClick={handleCheck}
      onKeyPress={handleCheck}
    >
      {!levelAvailable && (
        <div className={styles.lockBackground}>
          <LockOutlinedIcon style={{ color: '#FFFFFF' }} />
        </div>
      )}
      <div
        className={styles.tileInnerRoot}
        tabIndex={0}
        role="button"
        onClick={handleCheck}
        onKeyPress={handleCheck}
      >
        <span className={styles.tileGoalText}>${amount} main bet</span>
        <span className={styles.tilePayoutText}>
          ${addons && addons.toFixed(2)} add ons
        </span>
      </div>
    </div>
  );
};

export default BetFormatTile;

interface BetFormatTileProps {
  amount: number;
  addons: number;
  category: string;
  checked: boolean;
  levelAvailable: boolean;
}
