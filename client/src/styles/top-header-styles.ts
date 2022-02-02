import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      padding: '16px 0',
      backgroundColor: '#031725',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      width: 30,
    },
    logoText: {
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '0.21rem',
      margin: '0 5px',
    },
    buttonContainer: {
      flex: 1,
      textAlign: 'right',
    },
    actionButton: {
      color: '#2F9BD8 !important',
      textTransform: 'none',
      '& span.MuiButton-label': {
        textTransform: 'none',
      },
    },
  }),
);

export default useStyles;
