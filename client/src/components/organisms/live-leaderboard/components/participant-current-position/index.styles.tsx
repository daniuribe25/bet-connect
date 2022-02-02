import styled from 'styled-components';
import { fontLarger, fontSmall, fontMediumSmall } from 'styles/typography';

export const Wrapper = styled.div<{ userIsInTheMoney: boolean }>`
  display: flex;
  justify-content: center;
  color: ${({ userIsInTheMoney }) => userIsInTheMoney ? '#B5A075' : 'white'};
`;

export const Divider = styled.div`
  width: 1px;
  background-color: #104A77;
  margin: 0 36px;
`;

export const LargeText = styled.div`
  ${fontLarger};
`;

export const SecondaryText = styled.div`
  ${fontSmall};
`;

export const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 16px 0;
`;

export const SubHeader = styled.span`
  ${fontMediumSmall};
  position: absolute;
  top: 4px;
`;

export const Currency = styled(SubHeader)`
  left: -10px;
`;

export const Position = styled(SubHeader)`
  right: -16px;
`;

export const InnerWrapper = styled.div`
  display: flex;
  position: relative;
`;
