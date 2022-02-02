import { FunctionComponent } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import LoadingSpinner from 'components/core/loading-spinner';

type LoadingProps = {
  show: boolean;
};

const useStyles = makeStyles((theme) =>
  createStyles({
    curtain: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#0c273a8c',
      zIndex: 10000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    text: {
      color: theme.palette.secondary.contrastText,
      marginTop: '.5rem',
    },
  }),
);

const Loading: FunctionComponent<LoadingProps> = (props: LoadingProps) => {
  const { show } = props;
  const classes = useStyles();

  return show ? (
    <div className={classes.curtain}>
      <LoadingSpinner size={80} />
    </div>
  ) : null;
};

export default Loading;
