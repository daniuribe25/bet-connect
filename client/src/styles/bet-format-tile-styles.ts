import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    flex: { display: 'flex' },
    taskListRoot: {
      backgroundColor: '#031725',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '10px',
      '& :first-child': {
        marginTop: '0 !important',
      },
      '& :last-child': {
        marginBottom: '0 !important',
      },
    },
    userBoxCont: {
      position: 'absolute',
      right: '5px',
      top: '8px',
    },
    modeDropDown: {
      position: 'absolute',
      left: '55px',
      top: '8px',
    },
    betAnteText: {
      fontSize: '20px',
      color: '#FFFFFF',
      fontWeight: 900,
    },
    tileRoot: ({ checked, bestValue, levelAvailable }: any) => ({
      position: 'relative',
      backgroundColor: !checked ? '#FFFFFF' : '#2F9BD8',
      padding: bestValue && !checked ? '0px' : '2px',
      margin: '10px 4px',
      borderRadius: '8px',
      boxShadow:
        bestValue && !checked && levelAvailable
          ? '0px 0px 15px #FFDF9E'
          : 'none',
      border:
        bestValue && !checked && levelAvailable ? '3px solid #B5A075' : 'none',
      cursor: 'pointer',
      flex: 1,
    }),
    tileInnerRoot: ({ checked }: any) => ({
      borderRadius: '8px',
      border: '1px solid #FFFFFF',
      backgroundColor: !checked ? '#FFFFFF' : '#2F9BD8',
      padding: '9px 0px',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
    }),
    tileGoalText: ({ checked }: any) => ({
      fontSize: '12.8px',
      fontWeight: 'bolder',
      color: !checked ? '#0C273A' : '#FFFFFF',
    }),
    tileAdditionText: ({ checked }: any) => ({
      fontSize: '10.5px',
      color: !checked ? '#3F7193' : '#FFFFFF',
      margin: '-5px 0 7px',
    }),
    tilePayoutText: ({ checked }: any) => ({
      fontSize: '10.24px',
      fontWeight: 500,
      color: !checked ? '#0C273A' : '#FFFFFF',
    }),

    betButtonTextRoot: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    betPerPersonText: {
      fontWeight: 900,
      fontSize: '20px',
      color: '#FFFFFF',
    },
    winPerPersonText: {
      fontWeight: 400,
      fontSize: '12.8px',
      lineHeight: '10px',
      margin: '-5px 0 5px',
      color: '#FFFFFF',
    },

    lockBackground: {
      width: '100%',
      height: '100%',
      backgroundColor: '#0c273ade',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'column',
    },
    lockText: {
      color: '#FFFFFF',
      fontSize: '10px',
    },
    btnsRoot: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    disbandBtn: {
      borderRadius: '30px',
      border: '1px solid #3F7193',
      color: '#3F7193',
      textTransform: 'none',
      padding: '2px 10px',
      margin: '8px',
      fontSize: '12px',
    },
    boxContainer: {
      padding: '1rem',
    },
    createTeamButtonText: {
      fontSize: 25,
      fontweight: 900,
    },
    createTeamButton: {
      width: '100%',
    },
  }),
);

export default useStyles;
