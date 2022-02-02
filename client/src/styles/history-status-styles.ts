import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    state: {
      display: 'inline',
      flexDirection: 'row',
      alignItems: 'center',
      padding: '2px 8px 4px;',
      borderRadius: '2px',
    },
    stateOpen: {
      backgroundColor: '#23ca78',
      color: '#fff',
    },
    stateSettled: {
      width: 'fit-content',
      backgroundColor: '#d4e2ec',
      color: '#0C273A',
    },
    statePending: {
      backgroundColor: '#F6BB43',
      color: '#0C273A',
    },
    stateWon: {
      backgroundColor: '#B5A075',
      color: '#ffffff',
    },
    stateUnresolved: {
      backgroundColor: '#D82F4B',
      color: '#ffffff',
    },
    stateText: {
      fontSize: '12.8px',
      lineHeight: '15px',
      margin: 'auto',
    },
  }),
);

export default useStyles;
