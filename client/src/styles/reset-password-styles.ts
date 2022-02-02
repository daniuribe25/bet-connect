import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      backgroundColor: '#031725',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: 'calc(100vh - 84px)',
      padding: 0,
    },
    box: {
      backgroundColor: '#031725',
      maxWidth: '600px',
      borderRadius: '10px',
      margin: '0',
    },
    inputCont: {
      margin: '5px !important',
    },
    input: {
      backgroundColor: 'white !important',
      color: '#272c36 !important',
    },
  }),
);

export default useStyles;
