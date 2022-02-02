import classnames from 'classnames';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { GameStatus, HistoryItemProps } from 'helpers/pl-types';
import { useHistoryStatusStyles } from 'styles/index';

// eslint-disable-next-line import/prefer-default-export
export const HistoryStatus: FunctionComponent<HistoryItemProps> = (
  props: HistoryItemProps,
) => {
  const css = useHistoryStatusStyles();
  const { state, date, tasks } = props;

  let returnAmount = 0;
  tasks.forEach((m) => {
    if (m.won) returnAmount += m.returnAmount;
  });
  let statusText = '';
  const now = moment.utc(new Date()).local();
  const gameDate = moment.utc(date).local();
  const hoursDiff = now.diff(gameDate, 'hours');

  if (state === GameStatus.WAITING && hoursDiff < 1) statusText = 'Pending';
  if (state === GameStatus.COMPLETE && returnAmount > 0)
    statusText = `Won $${returnAmount.toFixed(2)}`;
  if (state === GameStatus.COMPLETE && returnAmount <= 0) statusText = 'Lost';
  if (state === GameStatus.CANCELLED) statusText = 'Cancelled';
  if (state === GameStatus.REFUNDED) statusText = 'Refunded';
  if (state === GameStatus.WAITING && hoursDiff > 0) statusText = 'Unresolved';
  return (
    <div
      className={classnames(css.state, {
        [css.statePending]: state === GameStatus.WAITING,
        [css.stateWon]: state === GameStatus.COMPLETE && returnAmount > 0,
        [css.stateSettled]:
          state === GameStatus.CANCELLED ||
          state === GameStatus.REFUNDED ||
          (GameStatus.COMPLETE && returnAmount <= 0),
        [css.stateUnresolved]: state === GameStatus.WAITING && hoursDiff > 0,
      })}
    >
      <span className={css.stateText}>{statusText}</span>
    </div>
  );
};
