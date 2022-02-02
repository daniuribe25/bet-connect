import formatMoney from 'helpers/format-money';

test('should return correct string when given an amount', () => {
  expect(formatMoney({ amount: 2 })).toBe('$2');
  expect(formatMoney({ amount: 12.5 })).toBe('$12.50');
  expect(formatMoney({ amount: 20.50 })).toBe('$20.50');
  expect(formatMoney({ amount: 1.6666666666666666667 })).toBe('$1.67');
})

test('does not display $ if includeCurrency is passed as false', () => {
  expect(formatMoney({ amount: 2, includeCurrency: false })).toBe('2');
  expect(formatMoney({ amount: 12.5, includeCurrency: false })).toBe('12.50');
})
