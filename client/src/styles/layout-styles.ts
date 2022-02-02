import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layoutRoot: ({ platform }) => ({
      width: '100%',
      maxWidth: '600px',
      margin: 'auto',
      boxSizing: 'border-box',
      textAlign: 'left',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: ['chrome', 'safari'].includes(platform)
        ? '-webkit-fill-available'
        : '100vh',
    }),
    defaultMobileLayoutRoot: () => ({
      flex: '1 1 auto',
      display: 'flex',
      overflowY: 'auto',
      overflowX: 'hidden',
      marginBottom: '0px',
      height: '-webkit-fill-available',
    }),
    childrenDelimiter: {
      flex: '1 1 auto',
      background: '#3F7193',
      backgroundSize: 'cover',
      display: 'flex',
      maxWidth: '100%',
    },
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
    },
    topBarRoot: {
      boxSizing: 'border-box',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1),
      paddingRight: theme.spacing(3),
      backgroundColor: '#031725',
      height: '50px',
      width: '100%',
      maxWidth: 600,
      margin: 'auto',
    },
    menuTabs: ({ tabsLength }: any) => ({
      width: '100%',
      backgroundColor: '#0C273A',
      display: 'flex',
      // position: 'absolute',
      zIndex: 10,
      // bottom: 0,
      padding: tabsLength === 3 ? '0 5rem 0 2rem' : '0 1rem 0 1rem',
    }),
    tabs: ({ location, highlightRoute, openTeamModal }: any) => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      fontSize: '11px',
      height: '55px',
      flex: 1,
      cursor: 'pointer',
      color:
        highlightRoute &&
        highlightRoute.includes(location?.pathname) &&
        !openTeamModal
          ? '#FFFFFF'
          : '#3F7193',
      '& svg': {
        marginBottom: '2px',
      },
    }),
    drawerPaper: {
      width: '80vw',
      maxWidth: '450px',
      position: 'absolute',
      padding: 0,
      backgroundColor: '#0C273A !important',
      '& .MuiDivider-root': {
        backgroundColor: '#3F7193',
      }
    },
    listItem: {
      fontSize: '14px',
      color: 'white !important',
    },
    icon: {
      margin: theme.spacing(),
      color: 'white',
    },
    listIcon: {
      minWidth: '30px !important',
    },
    MUiIcon: {
      color: 'white',
      fontSize: '24px',
      position: 'relative',
      left: -3,
    },
    menuTopCont: {
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem 1.2rem',
    },
    menuUserCont: {
      display: 'flex',
      marginBottom: '0.4rem',
    },
    menuUserText: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '0.6rem',
    },
    userCircle: {
      borderRadius: '50%',
      color: '#2F9BD8',
      fontSize: '24px',
      fontWeight: 'bold',
      border: '1.5px solid white',
      width: '45px',
      height: '45px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0C273A',
    },
    addFundsBtn: {
      fontSize: '15px !important',
      height: '42px !important',
      fontWeight: 500,
    },
    menuPrivacyLink: {
      position: 'absolute',
      bottom: '10px',
      left: '15px',
      color: 'white !important',
      display: 'flex',
      fontSize: '13.5px',
      cursor: 'pointer',
      '& a': {
        textDecoration: 'underline',
        color: 'white !important',
      },
    },
  }),
);

export default useStyles;
