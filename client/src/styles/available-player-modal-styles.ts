import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    _dialogRoot: {
      maxHeight: 'none',
      position: 'absolute',
      top: '0rem',
      margin: 0,
      height: '100%',
      borderRadius: 0,
      width: '100%',
      backgroundColor: '#031725',
      // @ts-ignore
      zIndex: '2 !important',
    },
    contentStyles: ({ isKeyboardOpen, playerListLength }: any) => ({
      padding: '0 !important',
      backgroundColor: '#031725',
      display: 'flex',
      justifyContent:
        isKeyboardOpen && playerListLength ? 'flex-end' : 'flex-start',
      flexDirection: 'column',
    }),
    title: {
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      padding: '1rem 1rem 0.5rem 1.5rem',
      '& h2': {
        margin: '0',
        fontSize: '22px',
      },
      '& span': {
        fontSize: '11px',
        position: 'relative',
        left: '0.4rem',
        top: '3px',
      },
    },
    footer: {
      height: 144,
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
    },
    searchInput: {
      backgroundColor: '#eaf0f5',
      borderRadius: 24,
      width: '100%',
      '& input': {
        color: theme.palette.primary.main,
        padding: '1rem 24px 1rem 0',
      },
      '& ::after, ::before': {
        display: 'none',
      },
      '& .MuiInputBase-root': {
        margin: '0 !important',
      },
      '& .MuiInputLabel-shrink': {
        display: 'none',
      },
    },
    searchIcon: {
      color: '#3F7193',
      marginLeft: '1rem',
    },
    actionSection: {
      maxWidth: '600px',
      position: 'fixed',
      bottom: '4.2rem',
      width: '100%',
      padding: '0 1rem',
    },
    updateButton: {
      background: '#2F9BD8',
      borderRadius: '24px',
      maxWidth: '700px',
      padding: '5px 20px',
      width: '100%',
      textAlign: 'center',
      margin: '1rem 0 0 0',
      color: theme.palette.text.primary,
      fontSize: '20px',
      fontWeight: 600,
      textTransform: 'none',
    },
    notFoundText: {
      color: 'gray',
      fontSize: '20px',
      alignSelf: 'center',
      marginTop: '5rem',
      padding: '0 2rem',
      textAlign: 'center',
    },
    banners: {
      display: 'flex',
      padding: '0.4rem 3%',
      '& .invite': {
        maxWidth: '47%',
        margin: '0 2%',
        height: '60px',
      },
      '& .discord': {
        maxWidth: '47%',
        margin: '0 2%',
        '& img': {
          width: '100%',
          height: '60px',
        },
      },
    },
    disbandBtn: {
      borderRadius: '30px !important',
      border: '1px solid #2F9BD8 !important',
      color: '#2F9BD8 !important',
      textTransform: 'none',
      padding: '2px 15px !important',
      fontSize: '12px !important',
      position: 'absolute',
      top: 20,
      right: 20,
    },
  }),
);

export default useStyles;
