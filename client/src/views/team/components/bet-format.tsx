import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/root-reducer';
import { useBetFormatStyles } from '../../../styles';
import BetFormatTile from './bet-format-tile';

// eslint-disable-next-line import/prefer-default-export
export const BetFormat: FunctionComponent = () => {
  const css = useBetFormatStyles({ isGameMode: false });
  const { pickedCategory } = useSelector(({ lobby }: RootState) => lobby);

  return (
    <div className={css.container}>
      <h3 className={css.header}>Bet format</h3>
      <div className={css.tilesContainer}>
        <BetFormatTile
          levelAvailable
          amount={3}
          addons={1}
          category="rookie"
          checked={pickedCategory === 'rookie'}
        />
        <BetFormatTile
          levelAvailable
          amount={5}
          addons={3}
          category="legend"
          checked={pickedCategory === 'legend'}
        />
        <BetFormatTile
          levelAvailable={false}
          amount={10}
          addons={5}
          category="diamond"
          checked={pickedCategory === 'diamond'}
        />
      </div>
    </div>
  );
};
