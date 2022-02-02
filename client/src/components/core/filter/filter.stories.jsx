import { useState } from 'react';
import styled from 'styled-components';
import Filter from '.';

export const ActivityFilter = () => {
  const [value, setValue] = useState('someValue');

  const onStateChange = (newValue) => {
    setValue(newValue);
  };

  const options = [
    {
      labelText: 'Bets',
      value: 'someValue',
    },
    {
      labelText: 'Tournaments',
      value: 'someOtherValue',
    },
  ];

  return (
    <>
      <Filter
        id="id"
        value={value}
        options={options}
        onChange={onStateChange}
      />
      {value === 'someValue' && <p>Hello someValue</p>}
      {value === 'someOtherValue' && <p>Hello someOtherValue</p>}
    </>
  );
};

export const FourCollumnFilter = () => {
  const [value, setValue] = useState('someValue');

  const onStateChange = (newValue) => {
    setValue(newValue);
  };

  const options = [
    {
      labelText: 'One',
      value: 'someValue',
    },
    {
      labelText: 'Two',
      value: 'someOtherValue',
    },
    {
      labelText: 'Three',
      value: 'someThirdValue',
    },
    {
      labelText: 'Four',
      value: 'someForthValue',
    },
  ];

  return (
    <>
      <Filter
        id="id"
        value={value}
        options={options}
        onChange={onStateChange}
      />
    </>
  );
};

export const StyledFilter = () => {
  const GreenFilter = styled(Filter)`
    background-color: green;
  `;

  const [value, setValue] = useState('someValue');

  const onStateChange = (newValue) => {
    setValue(newValue);
  };

  const options = [
    {
      labelText: 'Matchmaking',
      value: 'someValue',
    },
    {
      labelText: 'Challenge',
      value: 'someOtherValue',
    },
  ];

  return (
    <>
      <GreenFilter
        id="id"
        value={value}
        options={options}
        onChange={onStateChange}
      />
      {value === 'someValue' && <p>Hello someValue</p>}
      {value === 'someOtherValue' && <p>Hello someOtherValue</p>}
    </>
  );
};

export default {
  title: 'Components/Core/Filter',
  component: ActivityFilter,
};
