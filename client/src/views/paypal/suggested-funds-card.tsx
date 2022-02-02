import { FunctionComponent } from 'react';
import SVG from 'assets/images/svgs';
import styled from 'styled-components';
import { fontSmall, fontMedium } from 'styles/typography';
import { Radio } from '@material-ui/core';

const CardWrapper = styled.div<{ popular?: boolean }>`
  background-color: ${({ popular, theme }) => !popular ? theme.dark.background.primary : '#5E2FD8'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin: 4px 0;
  border-radius: 8px;
`;

const PopularPill = styled.div`
  background-color: ${({ theme }) => theme.light.background.primary};
  border-radius: 2px;
  padding: 2px 7px;
  color: #5E2FD8;
  ${fontSmall};
`;

const AmountText = styled.div`
  ${fontMedium};
  font-weight: 900;
  color: ${({ theme }) => theme.dark.text.primary};
`;

const CheckContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
interface SuggestedFundsCardProps {
  value: number;
  selected: boolean;
  popular?: boolean;
  onChange: (value: number) => any;
}

const SuggestedFundsCard: FunctionComponent<SuggestedFundsCardProps> = ({
  value,
  selected,
  popular,
  onChange,
}: SuggestedFundsCardProps) => {
  const handleChange = (): void => onChange(value);

  return (
    <CardWrapper
      role="button"
      popular={popular}
      tabIndex={0}
      onKeyPress={handleChange}
      onClick={handleChange}
    >
      <AmountText>{`$${value}`}</AmountText>
      <CheckContainer>
        {popular && <PopularPill>Most popular</PopularPill>}
        <Radio
          icon={<SVG icon="action:radioButton" />}
          checkedIcon={<SVG icon="action:radioButtonChecked" />}
          checked={selected}
          onChange={handleChange}
          value={value}
          inputProps={{ 'aria-label': 'A' }}
        />
      </CheckContainer>
    </CardWrapper>
  );
};

export default SuggestedFundsCard;
