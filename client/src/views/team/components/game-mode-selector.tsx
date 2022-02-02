import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { GameModes } from '../../../helpers/pl-types';
import { RootState } from '../../../redux/root-reducer';
import { useBetFormatStyles } from '../../../styles';
import GameModeTile from './game-mode-tile';

const GameModeSelector: FunctionComponent = () => {
  const css = useBetFormatStyles({ isGameMode: true });
  const { gameMode } = useSelector(({ lobby }: RootState) => lobby);

  return (
    <div className={css.container}>
      <h3 className={css.header}>Map</h3>
      <div className={css.tilesContainer}>
        {/* <GameModeTile
          gameMode={GameModes.Verdansk}
          gameModeText="Verdansk"
          checked={gameMode === GameModes.Verdansk}
        /> */}
        <GameModeTile
          gameMode={GameModes.Caldera}
          gameModeText="Caldera"
          checked={gameMode === GameModes.Caldera}
        />
        <GameModeTile
          gameMode={GameModes.Rebirth}
          gameModeText="Rebirth Island"
          checked={gameMode === GameModes.Rebirth}
        />
      </div>
    </div>
  );
};

export default GameModeSelector;
