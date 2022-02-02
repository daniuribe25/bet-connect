import { usBetSlipStyles } from 'styles/index';
import { SnackbarMessage } from 'notistack';

const BetConfirmedAlert = ({ message }: { message: SnackbarMessage }): JSX.Element => {
  const styles = usBetSlipStyles({});
  return (
    <div className={styles.alertRoot}>
      <span className={styles.alertTitle}>{message}</span>
      <span className={styles.alertSubtitle}>Have a great match!</span>
    </div>
  );
};

export default BetConfirmedAlert;
