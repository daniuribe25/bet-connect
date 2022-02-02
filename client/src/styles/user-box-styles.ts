import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    usersCont: ({ isCaptain }: any) => ({
      display: 'flex',
      border: '1px solid #3F7193',
      borderRadius: '36px',
      padding: '4px',
      width: isCaptain ? '200px' : '180px',
      minHeight: '38px',
    }),
    mainBetCont: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 2,
    },
    mainBetText: {
      color: '#FFFFFF',
      fontSize: '12px',
      fontWeight: 700,
      textAlign: 'center',
    },
    updateIcon: {
      color: '#3F7193',
      width: '26px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      cursor: 'pointer',
    },
    gamemodeText: {
      color: '#3F7193',
      fontSize: '10.24px',
      fontWeight: 400,
      marginTop: '-2px',
      textTransform: 'capitalize',
    },
    userBoxRoot: ({ usersLength }: any) => {
      let width = '';
      // eslint-disable-next-line default-case
      switch (usersLength) {
        case 1:
        case 2:
          width = '50px';
          break;
        case 3:
          width = '70px';
          break;
        case 4:
          width = '85px';
          break;
      }
      return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width,
        height: '26px',
        position: 'relative',
        cursor: 'pointer',
      };
    },
    userCircle: {
      borderRadius: '50%',
      border: '1.5px solid white',
      width: '26px',
      height: '26px',
      display: 'flex',
      color: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: '-3px',
      '& svg': {
        fontSize: '15px',
        position: 'relative',
        top: '3px',
        left: '-1px',
      },
    },
    userLetter: {
      fontSize: '16px',
      color: 'white',
    },
  }),
);

export default useStyles;
