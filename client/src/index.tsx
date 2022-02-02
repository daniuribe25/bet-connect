import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { createClient, Provider as UrqlProvider } from 'urql';
import { ErrorBoundary } from './helpers/bugsnag';
import App from './app';
import store from './redux/store';
import apolloClient from './api/apollo/client';
import registerErrorHandlers from './helpers/error-handlers';

document.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  { passive: false },
);

const client = createClient({
  url: 'https://api-us-east-1.graphcms.com/v2/ckbjhy22m02f001w9fz0bcbzv/master',
});

registerErrorHandlers(store);

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <UrqlProvider value={client}>
          <Provider store={store}>
            <App />
          </Provider>
        </UrqlProvider>
      </ApolloProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);
