import React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import { REACT_APP_BUGSNAG_API_KEY } from './env';

Bugsnag.start({
  apiKey: REACT_APP_BUGSNAG_API_KEY,
  plugins: [new BugsnagPluginReact()],
});

export const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(
  React,
);

export default Bugsnag;
