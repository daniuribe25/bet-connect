import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ModalProvider } from '../src/util/modal-context/modal-context'
import { ToastProvider } from '../src/util/toast-context/toast-context';
import globalTheme from 'styles/global-theme';
import GlobalStyle from '../global-styles';
import theme from 'styles/theme';
import { CssBaseline } from '@material-ui/core';
import { addDecorator } from '@storybook/react';

addDecorator((Story) => {
  return (
    <StyledComponentsThemeProvider theme={globalTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        <ToastProvider>
          <ModalProvider>
            <Story />
          </ModalProvider>
        </ToastProvider>
      </ThemeProvider>
    </StyledComponentsThemeProvider>
  );
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
