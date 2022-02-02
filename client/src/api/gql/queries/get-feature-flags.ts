import { gql } from '@apollo/client';

const getFeatureFlags = gql`
  query FeatureFlag($flag: String) {
    getFeatureFlag(input: { domain: $flag }) {
      domain
      value
    }
  }
`;

export default getFeatureFlags;
