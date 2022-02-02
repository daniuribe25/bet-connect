import styled, { css } from 'styled-components';
import { fontSmaller } from 'styles/typography';

type VariantType = 'light' | 'lightBlue' | 'dark' | 'secondaryDark' | 'info' | 'warning' | 'success' | 'highlight' | 'winner';
type VariantSize = 'small';

const labelSize = {
  small: css`
    padding: 2px 5px;
    ${fontSmaller};
  `,
}

const Label = styled.span<{ variant: VariantType, size: VariantSize }>`
  border-radius: 2px;
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: ${({ theme, variant }) => theme[variant].background.primary};
  color: ${({ theme, variant }) => theme[variant].text.primary};
  ${({ size }) => labelSize[size]};
`;

export default Label;

