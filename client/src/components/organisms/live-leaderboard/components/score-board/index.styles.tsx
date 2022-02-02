import styled from 'styled-components';
import { fontMediumSmall, fontSmaller } from 'styles/typography';

export const Row = styled.div<{ isUsersTeam?: boolean, teamIsInTheMoney?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: ${({ teamIsInTheMoney, isUsersTeam }) => {
    if (isUsersTeam) {
      if (teamIsInTheMoney) {
        return '#B5A075';
      }
      return '#104A77'
    }
    return 'transparent'
  }};
`;

export const MainText = styled.div`
  ${fontMediumSmall};
`;

export const SecondaryText = styled.div<{ isUsersTeam?: boolean, teamIsInTheMoney?: boolean }>`
  ${fontSmaller}
  color: ${({ teamIsInTheMoney, isUsersTeam }) => {
    if (!isUsersTeam && teamIsInTheMoney) {
      return '#B5A075';
    }
    return 'white';
  }};
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
