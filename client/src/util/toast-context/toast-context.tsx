import { Toast } from 'components/core/banner';
import { Portal } from '@material-ui/core';
import { useState, createContext } from 'react';
import secondsFromCharacters from './helpers';

type ToastType = {
  displayToast: (arg: any) => void;
  dismissToast: (arg: any) => void;
};

export const ToastContext = createContext<ToastType | null>(null);

let timeoutId: NodeJS.Timeout | null = null;

export const ToastProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const defaultToast = {
    toastDisplayed: false,
    clickToDismiss: false,
    type: 'info',
    heading: undefined,
    subtext: undefined,
    displayOptions: false,
    firstBtnOnClick: () => {},
    firstBtnText: undefined,
    secondBtnOnClick: () => {},
    secondBtnText: undefined,
    children: undefined,
    closeButton: false,
    position: 'top',
  };

  const [toast, setToast] = useState(defaultToast);

  const dismissToast = (): void => {
    setToast(defaultToast);
  };

  const displayToast = (toastData: any): void => {
    if (toast.toastDisplayed) {
      dismissToast();
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    setToast(toastData);

    if (
      !toastData?.clickToDismiss &&
      !toastData?.disableTimeout &&
      !toastData?.closeButton
    ) {
      timeoutId = setTimeout(() => {
        dismissToast();
      }, secondsFromCharacters(toastData?.heading, toastData?.subtext));
    }
  };

  return (
    <ToastContext.Provider value={{ displayToast, dismissToast }}>
      {toast.toastDisplayed && (
        <Portal>
          <Toast dismissToast={dismissToast} toastData={toast} />
        </Portal>
      )}
      {children}
    </ToastContext.Provider>
  );
};
