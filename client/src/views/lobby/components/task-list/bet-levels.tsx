import { useRef, useEffect, FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/root-reducer';
import { useBetTasksStyles } from 'styles/index';
import BetTile from './bet-tile';

interface BetLevelsProps {
  type: 'main' | 'placement' | 'damage';
  bet: Array<betType>;
  ante: number;
}

export const BetLevels: FunctionComponent<BetLevelsProps> = (
  props: BetLevelsProps,
) => {
  const { bet, type, ante } = props;
  const styles = useBetTasksStyles(props);
  const ref = useRef<any>(null);
  const { pickedBets, isCaptain } = useSelector(
    ({ lobby }: RootState) => lobby,
  );

  useEffect(() => {
    if (ref?.current) {
      const element = ref.current;
      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      element.scrollLeft = maxScrollLeft / 3;
    }
  }, [ref]);

  useEffect(() => {
    if (ref?.current && !isCaptain) {
      const element = ref.current;
      let index = 0;
      bet?.forEach((b: any, i: number) => {
        if (pickedBets[type].checked && pickedBets[type].level === b.level)
          index = i;
      });
      element.scrollLeft = 146 * index;
    }
  }, [pickedBets]);

  const orderedBet = [...bet];

  return (
    <div className={styles.hscrollable} ref={ref}>
      {orderedBet
        ?.sort((a, b) => {
          return a.level - b.level;
        })
        .splice(0, 3)
        .map((b, i) => (
          <BetTile
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            index={i}
            amount={b.goal}
            type={type}
            level={b.level}
            levels={bet?.length}
            payout={b.payout}
            ante={ante}
          />
        ))}
    </div>
  );
};

export default BetLevels;

type betType = {
  level: number;
  goal: number;
  payout: number;
};
