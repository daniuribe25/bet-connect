import styled from 'styled-components';
import { fontSmall } from 'styles/typography';

export const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.dark.background.primary};
  border-radius: 8px;
`;

export const UserPositionWrapper = styled.div`
  padding: 16px;
  border-top: 1px solid #104A77;
  border-bottom: 1px solid #104A77;
`;

export const TargetWrapper = styled.div`
  display: flex;
  padding: 16px;
  justify-content: center;
`;

export const ViewAllScoresWrapper = styled.div`
  border-top: 1px solid #104A77;
  padding: 16px;
  color: #2F9BD8;
  ${fontSmall};
  cursor: pointer;
  text-align: center;
`;

export const ScoreboardWrapper = styled.div`
  border-top: 1px solid #104A77;
  padding: 16px 0;
`;
