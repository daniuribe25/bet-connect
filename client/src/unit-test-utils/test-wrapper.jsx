import { ThemeProvider } from 'styled-components';
import globalTheme from 'styles/global-theme';
import { ModalProvider } from '../util/modal-context/modal-context';
import { ToastProvider } from '../util/toast-context/toast-context';

const Wrapper = ({ children }) => {
  return (
    <ThemeProvider theme={globalTheme}>
      <ToastProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default Wrapper;
