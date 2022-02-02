import { createStyles, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { FunctionComponent } from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    alertDismiss: {
      border: '1px solid #FFFFFF',
      borderRadius: '15px',
      padding: '2px 15px',
      width: '6rem',
      textAlign: 'center',
    },
  }),
);

export const DismissButton: FunctionComponent<any> = ({ id, onClick }: any) => {
  const styles = useStyles({});
  const { closeSnackbar } = useSnackbar();
  const handleClick = (): void => {
    closeSnackbar(id);
    if (onClick) { onClick(); }
  };
  return (
    <span
      onClick={handleClick}
      onKeyPress={handleClick}
      tabIndex={0}
      role="button"
      className={styles.alertDismiss}
    >
      Dismiss
    </span>
  );
};

export default DismissButton;
