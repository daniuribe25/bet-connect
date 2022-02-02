import { Fragment, FunctionComponent } from 'react';
import styled from 'styled-components';
import { formatTime } from 'helpers/common';
import { LobbyStats, UserStats } from 'helpers/pl-types';
import { fontMediumSmall } from 'styles/typography';

type PerformanceStatsType = {
  rows?: Array<UserStats>;
  lobbyStats?: LobbyStats;
};

const Separator = styled.div`
  height: 1px;
  background-color: #104A77;
  align-self: center;
  width: 100%;
`;

const StatRow = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StatTitle = styled.div`
  ${fontMediumSmall}
`;

const SectionHeader = styled(StatTitle)`
  padding-left: 16px;
`;

const StatsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 16px;
  border-radius: 8px;
  padding: 4px 0;
  background-color: ${({ theme }) => theme.dark.background.primary};
`;

const InnerColumn = styled.div`
  width: 33.333%;
  padding: 0 5px;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  flex: 1;
  margin: 0 16px;
  justify-content: space-between;
`;

const RightColumnHeader = styled.div`
  text-align: right;
  display: flex;
  width: 50%;
  color: #3F7193;
  margin-right: 16px;
`;

const RightColumnValues = styled.div`
  text-align: right;
  display: flex;
  width: 50%;
`;

const LeftColumn = styled.div`
  text-align: left;
  flex: 1;
  font-weight: 700;
`;

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.darkest.background.primary};
`;

const InnerWrapper = styled.div`
  padding: 16px 0;
`;

const PerformanceStats: FunctionComponent<PerformanceStatsType> = ({
  rows = [],
  lobbyStats,
}: PerformanceStatsType) => {
  const roundValues = (value: number): number => {
    return Math.round(value * 100) / 100;
  }

  const getGulagString = (gulagValue: boolean | null): string => {
    if (gulagValue) {
      return 'W';
    }
    if (gulagValue === false) {
      return 'L'
    }
    return '-';
  }

  return (
    <Wrapper>
      {rows?.length > 0 && (
        <InnerWrapper>
          <Header>
            <StatTitle>Performance</StatTitle>
            <RightColumnHeader>
              <InnerColumn>Gulag</InnerColumn>
              <InnerColumn>Damage</InnerColumn>
              <InnerColumn>Kills</InnerColumn>
            </RightColumnHeader>
          </Header>
          <StatsContainer>
            {rows?.map((r, i) => (
              <Fragment key={`stats${r.userId}`}>
                <StatRow>
                  <LeftColumn>{r.platformUsername}</LeftColumn>
                  <RightColumnValues>
                    <InnerColumn>{getGulagString(r?.gulag)}</InnerColumn>
                    <InnerColumn>{r.damage}</InnerColumn>
                    <InnerColumn>{r.kills}</InnerColumn>
                  </RightColumnValues>
                </StatRow>
                {i < rows.length - 1 && <Separator />}
              </Fragment>
            ))}
          </StatsContainer>
        </InnerWrapper>
      )}
      {lobbyStats && (
        <InnerWrapper>
          <SectionHeader>Lobby stats</SectionHeader>
          <StatsContainer>
            <StatRow>
              <StatTitle>Average K/D</StatTitle>
              <StatTitle>{roundValues(lobbyStats.kda)}</StatTitle>
            </StatRow>
            <Separator />
            <StatRow>
              <StatTitle>Average kills per player</StatTitle>
              <StatTitle>{roundValues(lobbyStats.kills)}</StatTitle>
            </StatRow>
            <Separator />
            <StatRow>
              <StatTitle>Average time alive</StatTitle>
              <StatTitle>{formatTime(lobbyStats.timeAlive)}</StatTitle>
            </StatRow>
          </StatsContainer>
        </InnerWrapper>
      )}
    </Wrapper>
  );
};

export default PerformanceStats;
