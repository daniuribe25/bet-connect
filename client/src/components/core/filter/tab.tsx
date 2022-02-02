// eslint-disable-next-line no-use-before-define
import React from 'react';
import styled from 'styled-components';
import { fontMediumSmall } from 'styles/typography';

const visuallyHidden = `
  position: absolute;
  overflow: hidden;
  margin: 0;
  width: 1px;
  height: 1px;
  clip-path: inset(100%);
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
`;

const StyledLabel = styled.label`
  text-align: center;
  cursor: pointer;
  padding: 0 16px;
`;

const StyledInput = styled.input`
  ${visuallyHidden}
`;

const StyledLabelText = styled.span<{ checked: boolean }>`
  ${fontMediumSmall}
  font-weight: ${({ checked }) => checked ? 700 : 400};
  :hover {
    font-weight: 700;
  }
  display: block;
  position: relative;
  color: ${({ theme }) => theme.info.text.secondary};
  padding-bottom: 16px;

  ::after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    right: 0;
    height: 0px;
    border: 2px solid transparent;
    border-radius: 2px;
    input[type='radio']:checked + & {
      background-color: ${({ theme }) => theme.info.background.primary};
      border-color: ${({ theme }) => theme.info.background.primary};
    }
  }
`;

type TabType = {
  id: string;
  onChange: (...args: any) => void;
  value: string;
  selected: string;
  labelText: string | React.ReactNode;
};

const Filter = ({
  id,
  onChange,
  value,
  selected,
  labelText,
}: TabType): JSX.Element => {
  const checked = selected === value;
  const radioId = `${id}_${value}`;

  return (
    <StyledLabel htmlFor={radioId}>
      <StyledInput
        id={radioId}
        type="radio"
        onChange={() => onChange(value)}
        checked={checked}
        aria-checked={checked}
        value={value}
      />
      <StyledLabelText checked={checked}>{labelText}</StyledLabelText>
    </StyledLabel>
  );
};

export default Filter;
