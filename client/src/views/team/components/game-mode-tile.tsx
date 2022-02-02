import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles } from '@material-ui/core';
import { setStoreProperty } from '../../../redux/slices/lobby-slice';
import { useBetFormatTilesStyles } from '../../../styles';
import { GameModes } from '../../../helpers/pl-types';
import { RootState } from '../../../redux/root-reducer';

const useStyles = makeStyles(() =>
  createStyles({
    tileRoot: ({ checked, levelAvailable }: any) => ({
      position: 'relative',
      backgroundColor: !checked ? '#FFFFFF' : '#2F9BD8',
      padding: !checked ? '0px' : '2px',
      margin: '10px 6px',
      borderRadius: '8px',
      boxShadow: !checked && levelAvailable ? '0px 0px 15px #FFDF9E' : 'none',
      border: !checked && levelAvailable ? '3px solid #B5A075' : 'none',
      cursor: 'pointer',
      flex: 1,
    }),
    tileInnerRoot: ({ checked }: any) => ({
      minWidth: 100,
      borderRadius: '8px',
      border: '1px solid #FFFFFF',
      backgroundColor: !checked ? '#FFFFFF' : '#2F9BD8',
      padding: '20px 9px',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
    }),
    tileGoalText: ({ checked }: any) => ({
      fontSize: '14px',
      fontWeight: 'bolder',
      color: !checked ? '#0C273A' : '#FFFFFF',
    }),
  }),
);

const GameModeTile: FunctionComponent<GameModeTileProps> = (
  props: GameModeTileProps,
) => {
  const { checked, gameModeText, gameMode } = props;
  const dispatch = useDispatch();
  const styles = useBetFormatTilesStyles({ checked });
  const classes = useStyles({ checked });
  const { isUpdatingTeam, isCaptain } = useSelector(
    ({ lobby }: RootState) => lobby,
  );

  const handleCheck = (): undefined => {
    if (!isCaptain) return;
    if (isUpdatingTeam) dispatch(setStoreProperty(['teamUpdated', true]));
    dispatch(setStoreProperty(['gameMode', gameMode]));
  };

  return (
    <div
      className={classes.tileRoot}
      tabIndex={0}
      role="button"
      onClick={handleCheck}
      onKeyPress={handleCheck}
    >
      <div
        className={classes.tileInnerRoot}
        tabIndex={0}
        role="button"
        onClick={handleCheck}
        onKeyPress={handleCheck}
      >
        <span className={styles.tileGoalText}>{gameModeText}</span>
      </div>
    </div>
  );
};

export default GameModeTile;

interface GameModeTileProps {
  gameMode: GameModes;
  gameModeText: string;
  checked: boolean;
}
