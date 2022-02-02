import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    betSlip: {
      display: 'flex',
      backgroundColor: '#eaf0f5',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
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
      color: '#0c273a',
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
      fontSize: '15px',
      lineHeight: '25px',
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
      cursor: 'pointer',
      position: 'absolute',
      bottom: '1rem',
      width: '90%',
    },
    placeBetDisabled: {
      border: '1px solid #0C273A',
      borderRadius: '25px',
      color: '#0C273A',
      fontSize: '17px',
      height: '48px',
      textAlign: 'center',
      lineHeight: '48px',
      marginTop: '1rem',
      cursor: 'pointer',
      position: 'absolute',
      bottom: '1rem',
      width: '90%',
    },
    itemsContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    alertRoot: {
      display: 'flex',
      flexDirection: 'column',
      color: '#FFFFFF',
    },
    alertTitle: {
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '3px',
    },
    alertSubtitle: {
      fontSize: '12px',
      marginBottom: '5px',
    },
    alertDismiss: {
      border: '1px solid #FFFFFF',
      borderRadius: '15px',
      padding: '2px 15px',
      width: '6rem',
      textAlign: 'center',
    },
  }),
);

export default useStyles;
