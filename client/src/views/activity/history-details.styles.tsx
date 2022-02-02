import styled from 'styled-components';
import { fontMediumSmall, fontSmall, fontSmaller } from 'styles/typography';
import Pill from 'components/core/pill';
import BottomInfoBar from 'components/core/bottom-info-bar';

export const HeaderWrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const TeamsWrapper = styled.div`
  display: flex;
  padding: 16px;
  justify-content: space-evenly;
`;

export const Teammate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 135px;
  background-color: ${({ theme }) => theme.darkest.background.primary};
`;

export const ItemsContainer = styled.div`
  background-color: ${({ theme }) => theme.dark.background.primary};
  border-radius: 8px;
  margin: 16px;
  display: flex;
  flex-direction: column;
`;

export const Separator = styled.div`
  border-top: 1px solid #104A77;
  height: 0px;
  width: 100%;
  align-self: center;
`;

export const HeaderText = styled.div`
  ${fontMediumSmall};
`;

export const SecondaryText = styled.div`
  ${fontSmall};
  color: ${({ theme }) => theme.dark.text.secondary};
`;

export const Ids = styled.div`
  ${fontSmaller}
  color: ${({ theme }) => theme.dark.text.secondary};
`;

export const HeaderInnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const HeaderTopSection = styled(HeaderInnerWrapper)`
  padding-bottom: 4px;
  align-items: flex-end;
`;

export const HeaderBottomSection = styled(HeaderInnerWrapper)`
  padding-top: 16px;
`;

export const BottomBar = styled(BottomInfoBar)`
  position: fixed;
  margin: 0 auto;
  left: auto;
`;

export const BetButton = styled(Pill)`
  margin-top: 16px;
`;


export const RememberBetButton = styled(BetButton)`
  cursor: default;
  opacity: 0.5;
  svg {
    margin-right: 8px;
  }
`;
