import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigators: {
      display: 'flex',
      justifyContent: 'center',
    },
    button: {
      margin: `0 ${theme.spacing()}px`,
      minWidth: '75px',
    },
    lobbySeatRoot: () => ({
      display: 'flex',
      alignItems: 'center',
      height: '60px',
      backgroundColor: theme.palette.primary.dark,
      padding: '6px',
      color: '#e0e0e0',
    }),
    row: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      paddingLeft: '15px',
      justifyContent: 'space-between',
    },
    platformIcon: {
      height: '16px',
      width: '16px',
      margin: `0 ${theme.spacing()}px`,
    },
    gradientBorder: () => {
      const topColor = theme.palette.primary.dark;
      const bottomColor = theme.palette.secondary.light;
      return {
        borderTop: `2px solid ${topColor}`,
        borderBottom: `2px solid ${bottomColor}`,
        backgroundImage: `linear-gradient(${topColor}, ${bottomColor}),\n        linear-gradient(${topColor}, ${bottomColor})`,
        backgroundSize: '2px 100%',
        backgroundPosition: '0 0, 100% 0',
        backgroundRepeat: 'no-repeat',
      };
    },
    blank: {
      height: '100%',
      width: '100%',
      background: `repeating-linear-gradient(
        45deg,
      ${theme.palette.primary.light},
      ${theme.palette.primary.light} 4px,
        ${theme.palette.primary.main} 4px,
        ${theme.palette.primary.main} 8px)`,
    },
    iconButton: { height: '20px', width: '20px', margin: '0 2.5px' },
    cont: { width: '100%' },
    clearIcon: { cursor: 'pointer' },
    inputFilter: {
      backgroundColor: theme.palette.secondary.light,
      borderRadius: '10px',
      padding: '0 20px 5px',
    },
    tagRoot: {
      backgroundColor: theme.palette.primary.main,
    },
    tagText: {
      color: 'white',
      marginLeft: theme.spacing(),
    },
    tagIcon: {
      color: 'white',
      '&:hover': {
        '& path': {
          color: '#20ee68',
        },
      },
      '&:active': {
        '& path:active': {
          color: '#03b903',
        },
      },
    },
    boxContainer: {
      padding: '1rem',
    },
    container: {
      color: theme.palette.primary.main,
      display: 'flex',
      padding: '0.3rem',
      backgroundColor: '#104A77',
      borderRadius: '83px',
      marginBottom: '0.5rem',
      overflow: 'hidden',
    },
    containerNoPlayer: {
      color: theme.palette.primary.main,
      display: 'flex',
      padding: '0.3rem',
      backgroundColor: 'transparent',
      borderRadius: '83px',
      marginBottom: '0.5rem',
      border: '1px solid #2F9BD8',
      height: 52,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#5b5bff4d',
      },
    },
    photo: {
      width: 40,
      height: 40,
      borderRadius: '50%',
    },
    playerName: {
      color: '#fff',
      fontSize: 14,
      height: 28,
      margin: 'auto 0 auto 0.5rem',
      width: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    icon: {
      width: 20,
      marginRight: '0.5rem',
      position: 'relative',
      top: 5,
    },
    leftItems: {
      width: 48,
      display: 'flex',
    },
    centerItems: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    rightItems: {
      width: 'fit-content',
      display: 'flex',
    },
    walletText: {
      color: '#D4E2EC',
      fontSize: 11,
      paddingLeft: 38,
      marginTop: 2,
    },
    separator: {
      border: '1px solid #D4E2EC',
      width: '100%',
      paddingLeft: '1rem',
    },
    removePlayer: {
      width: 32,
      height: 34,
      color: `${theme.palette.primary.main} !important`,
      margin: 'auto !important',
      minWidth: '0 !important',
    },
    addPlayer: {
      width: 26,
      height: 26,
      color: '#2F9BD8',
      margin: 'auto 0 auto 10px',
      minWidth: '0',
    },
    invitePlayer: {
      color: '#fff',
      fontSize: 16,
      margin: 'auto auto auto 24px',
    },
    cancelPlayer: {
      color: '#D82F4B',
      textTransform: 'none',
    },
    captain: {
      backgroundColor: '#fff',
      padding: '1px 6px',
      color: theme.palette.primary.main,
      height: 16,
      fontSize: 11,
      margin: 'auto',
      marginRight: 32,
      whiteSpace: 'nowrap',
    },
    pending: {
      backgroundColor: '#fff',
      padding: '1px 6px',
      color: theme.palette.primary.main,
      height: 16,
      fontSize: 11,
      margin: 'auto',
      whiteSpace: 'nowrap',
    },
    joined: {
      backgroundColor: '#23CA78',
      padding: '1px 6px',
      color: theme.palette.primary.main,
      height: 16,
      fontSize: 11,
      margin: 'auto',
      whiteSpace: 'nowrap',
    },
    declined: {
      backgroundColor: '#D82F4B',
      padding: '1px 6px',
      color: '#fff',
      height: 16,
      fontSize: 11,
      margin: 'auto',
      whiteSpace: 'nowrap',
    },
    crownIcon: {
      marginRight: 5,
    },
    tagContainer: {
      display: 'flex',
      whiteSpace: 'nowrap',
      width: '100%',
    },
    avatar: {
      width: '42px',
      height: '42px',
      position: 'relative',
      top: '2px',
      left: '2px',
    },
  }),
);

export default useStyles;
