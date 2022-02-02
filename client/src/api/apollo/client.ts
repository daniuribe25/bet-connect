import {
  ApolloClient,
  createHttpLink,
  DefaultOptions,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { REACT_APP_API_BASE_URL } from 'helpers/env';
import storage, { AUTH_TOKEN } from 'helpers/storage';

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: storage.get(AUTH_TOKEN),
    },
  };
});

const httpLink = createHttpLink({ uri: `${REACT_APP_API_BASE_URL}/gql` });

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const plConnectApolloClient = new ApolloClient({
  ssrMode: typeof window === undefined,
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  defaultOptions,
});

export default plConnectApolloClient;
