import { Box, Button } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { getBetAnte, getMapAndSquadSizeCopy } from 'helpers/common';
import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/root-reducer';
import { setStoreProperty } from 'redux/slices/lobby-slice';
import { useBetTasksStyles } from 'styles/index';

// eslint-disable-next-line no-shadow
export enum GameModeBottomSheetStates {
  closed, openGameMode, openCategory
}

const GameModePicker: FunctionComponent = () => {
  const styles = useBetTasksStyles({});
  const dispatch = useDispatch();
  const { isCaptain, gameMode, squadSize, pickedCategory } = useSelector(({ lobby }: RootState) => lobby);
  const mainAnte = getBetAnte(pickedCategory, true);

  const handleClickConfDropdown = (state: GameModeBottomSheetStates): void => {
    if (isCaptain) {
      dispatch(setStoreProperty(['gameModeBottomSheetStatus', state]))
    }
  }

  return (
    <Box className={styles.confPillsContainer}>
      <Button
        className={styles.updateConfBtn}
        onClick={() => handleClickConfDropdown(GameModeBottomSheetStates.openGameMode)}
      >
        {isCaptain && <ArrowDropDownIcon />}
        {getMapAndSquadSizeCopy(gameMode, squadSize)}
      </Button>
      <Button
        className={styles.updateConfBtn}
        onClick={() => handleClickConfDropdown(GameModeBottomSheetStates.openCategory)}
      >
        {isCaptain && <ArrowDropDownIcon />}
        {`$${mainAnte} main`}
      </Button>
    </Box>
  );
}

export default GameModePicker;