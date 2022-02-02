import { Store } from '@reduxjs/toolkit';
import { buildMessages } from './common';
import { handleSessionErrors } from '../redux/slices/session-slice';

const safeErrors = [
  'Script error.',
  'Mutation',
  'mutation',
  'MUTATION',
  'closed before response',
  'removed from DOM',
];

const registerErrorHandlers = (store: Store): void => {
  window.addEventListener('error', (event) => {
    if (safeErrors.some((err: string) => event.message.includes(err))) return;
    store.dispatch<any>(
      handleSessionErrors(buildMessages([event.message], 'error')),
    );
  });

  window.addEventListener(
    'unhandledrejection',
    (event: PromiseRejectionEvent) => {
      store.dispatch<any>(
        handleSessionErrors(buildMessages([event.reason.message], 'error')),
      );
    },
  );
};

export default registerErrorHandlers;
