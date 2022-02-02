import styled from 'styled-components';
import { fontMediumLarge } from 'styles/typography';

const Pill = styled.button<{ variant: 'info' | 'warning' | 'success'}>`
  font-family: 'Lato';
  ${fontMediumLarge};
  color: ${({ theme, variant }) => theme[variant].text.primary};
  height: 48px;
  background-color: ${({ theme, variant }) => theme[variant].background.primary};
  border: none;
  border-radius: 24px;
  display: flex;
  align-items: center;
  padding: 0;
  cursor: pointer;
  width: 100%;
  justify-content: center;
`;

export default Pill;
