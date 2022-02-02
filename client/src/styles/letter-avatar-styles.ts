import { createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: 42,
      height: 42,
      borderRadius: '50%',
      backgroundColor: '#061622',
      display: 'flex',
      position: 'relative',
      top: 2,
      left: 2,
    },
    letters: ({ cant, width }: any) => ({
      color: '#c92e4a',
      margin: 'auto',
      // eslint-disable-next-line no-nested-ternary
      fontSize: width
        ? cant === 1
          ? width * 0.58
          : width * 0.47
        : cant === 1
        ? 24
        : 20,
      textTransform: 'uppercase',
    }),
  }),
);

export default useStyles;
