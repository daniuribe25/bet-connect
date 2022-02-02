import { useState } from 'react';
import { render, fireEvent } from 'unit-test-utils';
import Filter from '.';

const MatchmakingFilter = () => {
  const [state, setState] = useState('someValue');

  const onChange = (newValue) => {
    setState(newValue);
  };

  const options = [
    {
      labelText: 'First',
      value: 'someValue',
    },
    {
      labelText: 'Second',
      value: 'someOtherValue',
    },
  ];

  return (
    <>
      <Filter id="id" value={state} options={options} onChange={onChange} />
      {state === 'someValue' && <p>Hello someValue</p>}
      {state === 'someOtherValue' && <p>Hello someOtherValue</p>}
    </>
  );
};

test('we can change the states in the filter', () => {
  const { getByText } = render(<MatchmakingFilter />);

  expect(getByText('Hello someValue')).toBeInTheDocument();
  expect(() => getByText('Hello someOtherValue')).toThrow();

  fireEvent.click(getByText('Second'));

  expect(getByText('Hello someOtherValue')).toBeInTheDocument();
  expect(() => getByText('Hello someValue')).toThrow();
});
