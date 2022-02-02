import styled from 'styled-components';
import { GameStatus } from 'helpers/pl-types';
import { fontMediumSmall } from 'styles/typography';

export interface BetItemPops {
  title: string;
  subtitle?: string;
  betAmount: number;
  returnAmount: number;
  state: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderText = styled.div`
  ${fontMediumSmall};
`;

const SecondaryText = styled.div<{ displayGreenText?: boolean}>`
  padding-top: 4px;
  ${fontMediumSmall};
  font-weight: 400;
  color: ${({ theme, displayGreenText }) => displayGreenText ? theme.success.text.secondary : theme.dark.text.secondary};
`;

export const TotalReturns = ({
  title,
  subtitle,
  betAmount,
  returnAmount,
  state,
}: BetItemPops): JSX.Element => (
  <Wrapper>
    <InnerWrapper>
      <HeaderText>{title}</HeaderText>
      <HeaderText>{`$${betAmount.toFixed(2)}`}</HeaderText>
    </InnerWrapper>
    <InnerWrapper>
      <SecondaryText>{subtitle}</SecondaryText>
      <SecondaryText displayGreenText={state !== GameStatus.WAITING && returnAmount > betAmount}>
        {`$${returnAmount.toFixed(2)}`}
      </SecondaryText>
    </InnerWrapper>
  </Wrapper>
);
