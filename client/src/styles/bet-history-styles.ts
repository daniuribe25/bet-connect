import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
    },
    content: {
      flex: 1,
      backgroundColor: '#eaf0f5',
    },
    footer: {
      height: '134px',
    },
    backButton: {
      color: '#3F7193 !important',
      position: 'relative',
      left: '1rem',
      top: '-10px',
      padding: '0',
    },
    gameTitle: {
      fontSize: '25px',
      lineHeight: '30px',
      fontWeight: 'bold',
      margin: 'auto auto auto 0',
    },
    mapTitle: {
      fontSize: '16px',
      lineHeight: '19px',
      fontWeight: 'bold',
      margin: '0 auto auto 0',
    },
    title: {
      display: 'flex',
      width: '100%',
      height: '76px',
    },
    columnLeft: {
      textAlign: 'left',
      width: '48px',
      marginLeft: '-1rem',
      display: 'flex',
    },
    columnRight: {
      textAlign: 'left',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

export default useStyles;
