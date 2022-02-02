import styled from 'styled-components';
import { fontMediumSmall } from 'styles/typography';

export const Table = styled.table`
  color: ${({ theme }) => theme.dark.text.primary};
  border-spacing: 0;
  border-collapse: collapse;
  ${fontMediumSmall}
`;

export const TableRow = styled.tr<{ highlighted: boolean }>`
  border: none;
  max-width: 600px;
  background-color: ${({ highlighted, theme }) =>
    highlighted ? theme.secondaryDark.background.primary : 'transparent'};
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

export const Placement = styled.td<{ teamIsInTheMoney?: boolean }>`
  min-width: 38px;
  font-weight: 400;
  padding-right: 16px;
  color: ${({ teamIsInTheMoney }) => teamIsInTheMoney ? '#B5A075' : 'white'};
`;

export const Score = styled.td`
  font-weight: 400;
  min-width: 38px;
`;

export const Prize = styled.td<{ teamIsInTheMoney?: boolean }>`
  padding-left: 16px;
  min-width: 60px;
  text-align: right;
  color: ${({ teamIsInTheMoney }) => teamIsInTheMoney ? '#B5A075' : 'white'};
`;

export const TeamName = styled.td`
  font-weight: 700;
`;

export const PreviewWrapper = styled.tr`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
