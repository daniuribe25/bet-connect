import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      background: 'rgba(3, 23, 37, 0.75)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backdropFilter: 'blur(10px)',
      zIndex: 1400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      transition: 'all 450ms cubic-bezier(0.32,1,0.23,1) 0ms',
    },
    bottomSheetRoot: {
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%',
      backgroundColor: '#0C273A',
      borderRadius: '15px 15px 0 0',
      display: 'flex',
      flexDirection: 'column',
      boxShadow:
        '0px 10px 20px rgba(0, 0, 0, 0.22), 0px 14px 56px rgba(0, 0, 0, 0.25)',
      borderTop: '1px solid #7e8a93'
    },
    section: {
      '& h3': {
        color: '#fff',
        fontSize: '25px',
        fontWeight: '600',
        margin: '20px 0 0 20px',
        fontFamily: 'Lato',
      },
      '& .betFormatLabel': {
        width: '100%',
        padding: '20px',
        backgroundColor: '#0C273A',
        borderColor: '#3F7193',
        borderBottomWidth: '0.5px',
        borderTopWidth: '0.5px',
        borderLeftWidth: '0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        '& h4': {
          color: '#fff',
          fontSize: '19px',
          fontWeight: '600',
          margin: '0',
          marginBottom: '4px',
          fontFamily: 'Lato',
        },
        '& span': {
          color: '#D4E2EC',
          fontSize: '15px',
          fontWeight: '400',
          textAlign: 'start',
          fontFamily: 'Lato',
        },
      },
      '& .betFormatLabelSelected': {
        borderLeft: '5px solid #2F9BD8',
        paddingLeft: '14px',
      },
      paddingBottom: '0px',
      flex: 1,
    },
    gameModeTiles: {
      display: 'flex',
      padding: '5px 10px',
      margin: '5px 0 10px 0',
    },
    gameModeTile: {
      flex: 1,
      padding: '30px 0px',
      display: 'flex',
      backgroundColor: '#0C273A',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #D4E2EC',
      borderRadius: '4px',
      margin: '5px',
      '& span': {
        color: 'white',
        fontWeight: '600',
        fontSize: '17px',
        fontFamily: 'Lato',
      }
    },
    gameModeTileSelected: {
      border: '1px solid #2F9BD8',
      backgroundColor: '#2F9BD8',
    },
  }),
);

export default useStyles;
