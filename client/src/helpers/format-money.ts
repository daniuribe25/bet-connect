interface FormatMoneyProps {
  amount: number
  includeCurrency?: boolean
}
const formatMoney = ({ amount, includeCurrency = true }: FormatMoneyProps): string => {
  const amountStringified = amount ? amount.toString().split('.') : ['0'];
  const includedCurrency = includeCurrency ? '$' : '';
  if (amountStringified.length === 1) {
    return `${includedCurrency}${amount}`;
  }
  return `${includedCurrency}${amount?.toFixed(2)}`
}

export default formatMoney;
