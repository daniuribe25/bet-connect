import styled from 'styled-components';
import formatMoney from 'helpers/format-money';
import { ParticipantTargetType } from 'helpers/pl-types';
import { fontMediumSmall } from 'styles/typography';

const Wrapper = styled.div`
  ${fontMediumSmall};
`;

const GoldText = styled.span`
  color: #B5A075;
`;

const ParticipantTarget = ({ target }: { target?: ParticipantTargetType }): JSX.Element => {
  const {
    scoreType,
    scoreToPlaceDifference,
    direction,
    prize
  } = target || {};

  const formattedMoney = prize?.prizeType === 'currency' ? formatMoney({ amount: Number(prize.value) }) : prize?.value;

  const upString = `${scoreToPlaceDifference} ${scoreType} away from `;

  const downString = `You're ahead by ${scoreToPlaceDifference} ${scoreType}`;
  return (
    <Wrapper>
      <span>{direction === 'UP' ? upString : downString}</span>
      {direction === 'UP' && <GoldText>{formattedMoney}</GoldText>}
    </Wrapper>
  )
}

export default ParticipantTarget;
