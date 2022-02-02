import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: '#031725',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: 'calc(100vh - 84px)',
      padding: 0,
    },
    registerRoot: {
      backgroundColor: '#031725',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100vh',
      padding: 0,
    },
    loginBox: {
      backgroundColor: '#031725',
      maxWidth: '600px',
      borderRadius: '10px',
      margin: '0',
    },
    orText: {
      margin: '10px 0 0px',
    },
    showPassButton: {
      right: 16,
      '&.MuiIconButton-edgeEnd': {
        position: 'absolute !important',
      },
    },
    inputCont: {
      margin: '10px 0 !important',
      '& .MuiFormLabel-root': {
        left: '12px !important',
      },
      '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
        color: '#2F9BD8'
      }
    },
    input: {
      backgroundColor: 'white !important',
      color: '#272c36 !important',
      borderRadius: '24px !important',
      height: '48px !important',
      padding: '0 !important',

      '& .MuiInputAdornment-positionEnd': {
        position: 'absolute !important',
        right: '16px !important',
      },
      '&:before, &:after': {
        display: 'none !important',
      },

      '& > input, input.MuiFilledInput-input, & input.MuiFilledInput-input:-webkit-autofill, & input.MuiFilledInput-input:-internal-autofill-selected': {
        backgroundColor: 'white !important',
        color: '#272c36 !important',
        borderRadius: '34px !important',
        height: 10,
        padding: '32px 42px 12px 24px !important',
        '&:before, &:after': {
          display: 'none !important',
        },
      },
      '&.MuiInputBase-root': {
        '& input': {
          backgroundColor: 'white !important',
          color: '#272c36 !important',
          borderRadius: '34px !important',
          height: 10,
          padding: '32px 42px 12px 24px !important',
          '&:before, &:after': {
            display: 'none !important',
          },
        },
      },
      '&.Mui-error .MuiInputBase-input': {
        border: '1px solid red',
      },
    },
    btnCont: {
      width: '100%',
      textAlign: 'center',
    },
    resetPasswordText: {
      color: '#2F9BD8',
      fontSize: '18px',
      textDecoration: 'none',
      marginTop: '-6px',
      marginBottom: 16,
    },
    casesensitive: {
      color: '#2F9BD8',
      position: 'absolute',
      right: '35px',
      paddingTop: '12px',
      fontWeight: 500,
    },
    phoneLabel: {
      position: 'relative',
      top: '25px',
      left: '55px',
      zIndex: 2,
      color: '#2F9BD8',
    },
    phoneInput: {
      borderRadius: '28px',
      fontSize: '17px',
      width: '100%',
      padding: '1.5rem 3.5rem 0.4rem',
    },
  }),
);

export default useStyles;
