import { fontSmall } from 'styles/typography';
import styled from 'styled-components';

const TagText = styled.span`
  color: #F6BB43;
  ${fontSmall};
`;

const Root = styled.div` 
  border-radius: 2px;
  border: 1px solid #F6BB43;
  height: fit-content;
  padding: 0 5px;
`;

const BetaTag = (): JSX.Element => {
  return (
    <Root>
      <TagText>BETA</TagText>
    </Root>
  );
};

export default BetaTag;
