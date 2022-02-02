import styled from 'styled-components';
import Label from 'components/core/label';
import SVG from 'assets/images/svgs';
import { fontLarger, fontSmall, fontSmaller } from 'styles/typography';
import formatMoney from 'helpers/format-money';

type TournamentPrizeTypes = {
  prizePool: number;
  prizeStyle: string;
  hasDivisions: boolean;
}

const Icon = styled(SVG)`
  height: 12px;
  width: 12px;
  margin-right: 3px;
  fill: ${({ theme }) => theme.dark.icon.primary};
`;

const DarkIcon = styled(Icon)`
  fill: ${({ theme }) => theme.dark.icon.primary};
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const PrizeAmount = styled.span`
   ${fontLarger};
   color: ${({ theme }) => theme.dark.text.primary};
   line-height: 2.5rem;
`;

const Currency = styled.span`
  ${fontSmall};
  color: ${({ theme }) => theme.dark.text.primary};
`;

const PrizeWrapper = styled.div`
  display: flex;
`;

const TotalPrizesText = styled.div`
  ${fontSmaller};
  color: ${({ theme }) => theme.dark.text.alternative};
  margin-bottom: 2px;
`;

const TournamentPrize = ({ prizePool, prizeStyle, hasDivisions}: TournamentPrizeTypes): JSX.Element => (
  <InnerWrapper>
    <PrizeWrapper>
      <Currency>$</Currency>
      <PrizeAmount>{formatMoney({ amount: prizePool, includeCurrency: false })}</PrizeAmount>
    </PrizeWrapper>
    <TotalPrizesText>{hasDivisions ? 'Prizes per division' : 'Total prizes'}</TotalPrizesText>
    <Label variant="secondaryDark" size="small">
      <DarkIcon icon="content:trophyOutline" />
      <span>{prizeStyle}</span>
    </Label>
  </InnerWrapper>
)

export default TournamentPrize;
