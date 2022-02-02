import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: ({ isGameMode }: any) => ({
      display: 'flex',
      margin: '1rem 0 0 0',
      padding: isGameMode ? '0.5rem 0 0 0' : '0 0 6rem 0',
      flexDirection: 'column',
    }),
    header: {
      color: theme.palette.text.primary,
      fontSize: 22,
      fontWeight: 900,
      paddingLeft: 8,
      margin: 0,
    },
    tilesContainer: {
      display: 'flex',
      width: '100%',
    },
  }),
);

export default useStyles;
