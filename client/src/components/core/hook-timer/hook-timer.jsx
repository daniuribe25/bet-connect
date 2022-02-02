import { useTimer, useStopwatch } from 'react-timer-hook';
import {
  calculateLaterTimestamp,
  renderAppropriateTimerSize,
} from 'helpers/time';
import TimerDisplay from './hook-timer.styles';

const Timer = ({ displayVariant, ...rest }) => {
  return (
    <TimerDisplay displayVariant={displayVariant}>
      {renderAppropriateTimerSize({
        ...rest,
      })}
    </TimerDisplay>
  );
};

const HookTimerCountUp = ({ ...props }) => {
  const timerProps = useStopwatch({
    autoStart: true,
  });
  return <Timer {...props} {...timerProps} />;
};

const HookTimerLoop = ({ secondsCountdown, ...props }) => {
  const restartOnExpire = (restart) => {
    restart(calculateLaterTimestamp(secondsCountdown));
  };
  const timerProps = useTimer({
    expiryTimestamp: calculateLaterTimestamp(secondsCountdown),
    onExpire: () => restartOnExpire(timerProps && timerProps.restart),
  });
  return <Timer {...props} {...timerProps} />;
};

const HookTimerCountDown = ({ secondsCountdown, onExpire, ...props }) => {
  const timerProps = useTimer({
    expiryTimestamp: calculateLaterTimestamp(secondsCountdown),
    onExpire,
  });
  return <Timer {...props} {...timerProps} />;
};

const HookTimer = ({
  cutOffFirstZero = false,
  loop = false,
  onExpire = () => {},
  secondsCountdown = 0,
  specificity = 'minutes',
  displayVariant = '',
}) => {
  if (!secondsCountdown) {
    return (
      <HookTimerCountUp
        displayVariant={displayVariant}
        specificity={specificity}
        cutOffFirstZero={cutOffFirstZero}
      />
    );
  }
  if (loop) {
    return (
      <HookTimerLoop
        displayVariant={displayVariant}
        secondsCountdown={secondsCountdown}
        specificity={specificity}
        cutOffFirstZero={cutOffFirstZero}
      />
    );
  }
  return (
    <HookTimerCountDown
      displayVariant={displayVariant}
      secondsCountdown={secondsCountdown}
      specificity={specificity}
      cutOffFirstZero={cutOffFirstZero}
      onExpire={onExpire}
    />
  );
};


export default HookTimer;
