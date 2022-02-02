import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    history: {
      display: 'flex',
      backgroundColor: '#eaf0f5',
      width: '100%',
      flexDirection: 'column',
      padding: '1rem',
      flex: 1,
      overflow: 'auto',
    },
    separator: {
      border: '1px solid #d4e2ec',
      height: '0',
      width: '96%',
      alignSelf: 'flex-end',
    },
    footer: {
      height: '134px',
      backgroundColor: '#fff',
      padding: '1rem',
    },
    row: {
      display: 'flex',
      width: '100%',
    },
    columnLeft: {
      textAlign: 'left',
      flex: 1,
    },
    columnRight: {
      textAlign: 'right',
    },
    bold: {
      fontWeight: 'bold',
    },
    subRow: {
      fontSize: '12.8px',
      lineHeight: '15px',
    },
    placeBet: {
      backgroundColor: '#23ca78',
      borderRadius: '25px',
      height: '48px',
      color: '#fff',
      textAlign: 'center',
      fontSize: '25px',
      lineHeight: '48px',
      fontWeight: 'bold',
      marginTop: '1rem',
    },
    notFoundText: {
      color: 'gray',
      fontSize: '20px',
      alignSelf: 'center',
      marginTop: '5rem',
      padding: '0 2rem',
      textAlign: 'center',
    },
  }),
);

export default useStyles;
