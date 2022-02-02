import styled from 'styled-components';
import { fontMediumSmall } from 'styles/typography';

type VariantType =
  | 'light'
  | 'lightBlue'
  | 'dark'
  | 'info'
  | 'warning'
  | 'success';

const BottomInfoBar = styled.div<{ variant: VariantType }>`
  padding: 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 0px 0px 16px 0px #0c273a;
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme, variant }) =>
    theme[variant].background.primary};
  color: ${({ theme, variant }) => theme[variant].text.primary};
  max-width: 600px;
  ${fontMediumSmall};
  font-weight: 400;
  text-align: center;
  border-top: ${({ variant }) => variant === 'dark' ? '1px solid rgba(255, 255, 255, 0.25)' : 'none'};
`;

export default BottomInfoBar;
