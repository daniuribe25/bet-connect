// eslint-disable-next-line no-use-before-define
import React from 'react';
import styled from 'styled-components';
import Tab from './tab';

type StyledRadioButtonsType = {
  columns: number;
};

const StyledRadioButtons = styled.div<StyledRadioButtonsType>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
`;

type OptionType = {
  labelText: string | React.ReactNode;
  value: string;
};

type FilterType = {
  id: string;
  options: OptionType[];
  onChange: (...args: any) => void;
  value: string;
  className?: string;
};

const Filters = ({
  id,
  options,
  value,
  onChange,
  className,
  ...rest
}: FilterType): JSX.Element => (
  <StyledRadioButtons
    {...rest}
    role="radiogroup"
    data-testid="radio-buttons"
    className={className}
    columns={options.length}
  >
    {options.map(({ labelText, value: radioValue }) => (
      <Tab
        id={id}
        selected={value}
        key={radioValue}
        value={radioValue}
        labelText={labelText}
        onChange={onChange}
        {...rest}
      />
    ))}
  </StyledRadioButtons>
);

export default Filters;
