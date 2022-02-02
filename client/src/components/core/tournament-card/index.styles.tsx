import styled from 'styled-components';
import { fontMedium, fontSmall } from 'styles/typography';

export const TournamentCardWrap = styled.div`
  height: 138px;
  background-color: ${({ theme }) => theme.dark.background.primary};
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border: 1px solid #104A77;
`;

export const TournamentName = styled.h2`
  ${fontMedium};
  color: ${({ theme }) => theme.dark.text.primary};
  margin: 0;
`;

export const HalfSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const RightHalfSection = styled(HalfSection)`
  align-items: flex-end;
`;

export const SecondaryText = styled.div`
  ${fontSmall};
  color: ${({ theme }) => theme.dark.text.alternative};
`;

export const ScoreFormat = styled(SecondaryText)`
  margin: 5px 0;
`;
