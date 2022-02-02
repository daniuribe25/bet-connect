import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    flex: { display: 'flex' },
    taskListRoot: {
      flexGrow: 1,
      paddingRight: '5px',
      backgroundColor: '#031725',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '10px',
      paddingBottom: '6.5rem',
      '& :first-child': {
        marginTop: '0 !important',
      },
      '& :last-child': {
        marginBottom: '0 !important',
      },
    },
    userBoxCont: ({ noStats }: any) => ({
      position: 'absolute',
      right: '15px',
      top: !noStats ? '10px' : 135,
    }),
    modeDropDown: {
      position: 'absolute',
      left: '55px',
      top: '8px',
    },
    selectedMapText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      top: '0.45rem',
      position: 'relative',
    },
    waitMessage: {
      fontSize: 16,
      color: '#fff',
      padding: '0.7rem',
      textAlign: 'center',
      border: '1px solid #2F9BD8',
      borderRadius: '50px',
      width: '90%',
    },
    betAnteText: {
      fontSize: '20px',
      color: '#FFFFFF',
      fontWeight: 900,
    },
    betDamageAnteText: {
      paddingBottom: '6px',
      marginTop: 0,
      display: 'block',
    },
    betBonusAnteText: {
      paddingLeft: '15px',
      marginTop: '10px',
    },
    betAnteTextAmount: {
      fontSize: '13px',
      fontWeight: 'lighter',
      color: '#23CA78',
      position: 'relative',
      top: '-1px',
    },
    hscrollable: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      maxWidth: '600px',
      overflow: 'hidden',
    },
    tileRoot: ({ checked, index }: any) => ({
      flex: 1,
      color: '#FFFFFF',
      backgroundColor: !checked ? '#031725' : '#23CA78',
      padding: '12px 0',
      marginTop: '10px',
      marginBottom: '10px',
      marginLeft: index !== 0 ? '10px' : 0,
      borderRadius: '4px',
      border: !checked ? '1px solid #3F7193' : 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    tileGoalText: {
      fontSize: '18px',
      fontWeight: 'bolder',
      marginBottom: '2px',
    },
    tilePayoutText: {
      fontSize: '14.8px',
      fontWeight: 500,
      flex: 3,
      letterSpacing: '0.1rem',
    },
    bestValueCont: {
      position: 'relative',
      width: 0,
      height: 0,
    },
    bestValueText: {
      backgroundColor: '#B5A075',
      borderRadius: '2px',
      fontSize: '10.5px',
      color: '#FFFFFF',
      textAlign: 'center',
      width: '62px',
      padding: '1px 4px',
      position: 'absolute',
      left: '42px',
      top: '-8px',
    },
    grandBetsCont: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 0',
    },
    grandBetsBtnChecked: ({ type }: any) => ({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      borderRadius: '4px',
      height: '80px',
      width: '49%',
      cursor: 'pointer',
      // margin: type === 'match' ? '10px 5px 10px 15px' : '10px 5px 10px 5px',
      background:
        type === 'match'
          ? 'linear-gradient(270deg, #F651C3 0%, #6F71FD 100%)'
          : 'linear-gradient(270deg, #FBAC45 0%, #F23E82 100%)',
      paddingLeft: '20px',
      alignItems: 'flex-start',
    }),
    grandBetsBtnUnchecked: ({ type }: any) => ({
      borderRadius: '4px',
      height: '80px',
      width: '49%',
      cursor: 'pointer',
      // margin: type === 'match' ? '10px 5px 10px 15px' : '10px 5px 10px 5px',
      padding: '1.5px',
      background:
        type === 'match'
          ? 'linear-gradient(270deg, #F651C3 0%, #6F71FD 100%)'
          : 'linear-gradient(270deg, #FBAC45 0%, #F23E82 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    grandBetsBtnText: {
      color: '#FFFFFF !important',
      margin: '3px 0',
    },
    grandBetsBtnInner: {
      paddingLeft: '18px',
      borderRadius: '4px',
      height: '76px',
      display: 'flex',
      backgroundColor: '#031725',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      flex: 1,
    },
    grandBetAnteCont: {
      position: 'relative',
      width: 0,
      height: 0,
    },
    grandBetAnteText: ({ anteColor }) => ({
      backgroundColor: '#FFFFFF',
      borderRadius: '2px',
      fontSize: '10.5px',
      color: anteColor,
      width: '40px',
      padding: '0px 4px',
      position: 'absolute',
      left: '47px',
      top: '3px',
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
      position: 'absolute',
      bottom: '4rem',
      width: '90%',
      textAlign: 'center',
      left: '5%',
    },
    placeBetBtnRoot: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 67,
      width: '100%',
      textAlign: 'center',
      backgroundColor: '#0C273A',
      borderRadius: '20px 20px 0 0',
      padding: '0 16px',
      border: '1px solid',
      maxWidth: '600px',
      borderImageSource:
        'linear-gradient(360deg, rgba(255, 255, 255, 0) 33.57%, rgba(255, 255, 255, 0.25) 100%)',
      '& button': {
        alignItems: 'baseline',
      }
    },
    createTeamBtnRoot: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    disbandContainer: ({ noStats }: any) => ({
      position: 'absolute',
      top: !noStats ? 5 : 139,
      right: 25,
    }),
    disbandBtn: {
      borderRadius: '30px !important',
      border: '1px solid #2F9BD8 !important',
      color: '#2F9BD8 !important',
      textTransform: 'none',
      padding: '2px 15px !important',
      fontSize: '12px !important',
    },

    updateConfBtn: {
      borderRadius: '30px !important',
      border: '1px solid white !important',
      color: 'white !important',
      textTransform: 'none',
      padding: '2px 14px 2px 8px !important',
      fontSize: '14px !important',
      marginLeft: '6px',
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
    placeBetDisabled: {
      background: '#2F9BD8',
      borderRadius: '25px',
      color: '#FFFFFF',
      fontSize: '17px',
      height: '48px',
      textAlign: 'center',
      lineHeight: '48px',
      marginTop: '1rem',
      width: '90%',
      marginBottom: '1rem',
      cursor: 'pointer',
    },
    refreshIcon: {
      position: 'relative',
      top: '6px',
      left: '-11px',
    },
    confPillsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      position: 'relative',
    }
  }),
);

export default useStyles;
