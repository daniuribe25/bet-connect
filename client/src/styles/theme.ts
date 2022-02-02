import { createTheme, responsiveFontSizes } from '@material-ui/core';

export const theme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: ['"Lato"', 'sans-serif'].join(','),
    },
    palette: {
      primary: {
        main: '#0c273a', // dark blue
        light: '#16476a', // light dark blue
      },
      secondary: {
        main: '#2f9bd8', // light blue
      },
      error: {
        main: '#FF0000', // red
      },
      background: {
        default: '#031725', // black
        paper: '#0c273a', // dark blue
      },
      text: {
        primary: '#ffffff',
      },
    },
  }),
);

export default theme;
