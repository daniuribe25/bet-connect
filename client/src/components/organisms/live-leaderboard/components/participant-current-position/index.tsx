
import moment from 'moment';
import { PayoutObject } from 'helpers/pl-types';
import formatMoney from 'helpers/format-money';
import {
  Wrapper,
  SectionWrapper,
  InnerWrapper,
  LargeText,
  Position,
  SecondaryText,
  Divider,
  Currency,
} from './index.styles';

type ParticipantCurrentPositionTypes = {
  prize?: PayoutObject | null;
  position: number;
  teamIsInTheMoney: boolean;
}

const ParticipantCurrentPosition = ({
  prize,
  position,
  teamIsInTheMoney,
}: ParticipantCurrentPositionTypes): JSX.Element => {
  const prizeMoney = formatMoney({ amount: prize?.value || 0, includeCurrency: false })
  const userPlacement = moment.localeData().ordinal(Number(position));
  const ordinal = userPlacement.split(`${position}`)[1];
  return (
    <Wrapper userIsInTheMoney={teamIsInTheMoney}>
      <SectionWrapper>
        <InnerWrapper>
          <LargeText>T{position}</LargeText>
          <Position>{ordinal}</Position>
        </InnerWrapper>

        <SecondaryText>your team</SecondaryText>
      </SectionWrapper>
      <Divider />
      <SectionWrapper>
        <InnerWrapper>
          <Currency>$</Currency>
          <LargeText>{prizeMoney}</LargeText>
        </InnerWrapper>

        <SecondaryText>current prize</SecondaryText>
      </SectionWrapper>
    </Wrapper>
  )
}

export default ParticipantCurrentPosition;
