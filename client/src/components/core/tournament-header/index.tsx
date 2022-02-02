import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import { tournamentStatuses } from 'helpers/pl-types'
import {
  formatDateTimeStringRelativeToNow,
  // getTimeUntil,
} from 'helpers/date-time';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { fontMediumSmall, fontSmall } from 'styles/typography';
import HookTimer from '../hook-timer/hook-timer';

type TournamentHeaderProps = {
  openTeamsModal: () => void;
  tournamentData: {
    teamsJoined: number;
    slotsAvailable: number;
    startAt: string;
    endsAt: string;
    tournamentStatus: tournamentStatuses;
  };
};

const Wrapper = styled.div`
  background-color: #031725;
  padding: 24px 16px 45px 16px;
  display: flex;
  justify-content: space-between;
`;

const ChevronIcon = styled(SVG)`
  fill: ${({ theme }) => theme.dark.icon.alternative};
  height: 12px;
  width: 12px;
  margin-left: 3px;
  margin-top: 1px;
`;

const PrimaryText = styled.div`
  color: ${({ theme }) => theme.dark.text.primary};
  ${fontMediumSmall}
  font-weight: 400;
`;

const SecondaryText = styled.div`
  ${fontSmall};
  color: ${({ theme }) => theme.dark.text.alternative};
`;

const JoinedTeamsButton = styled.div`
  padding: 0;
  cursor: pointer;
`;

const JoinedWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;
`;

const StartTime = styled(SecondaryText)`
  margin-top: 3px;
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Container = styled.div`
  text-align: right;
`;

const TournamentHeader = ({
  tournamentData,
  openTeamsModal,
}: TournamentHeaderProps): JSX.Element => {
  const { teamsJoined, slotsAvailable, startAt, endsAt, tournamentStatus } = tournamentData;
  const teamsString = slotsAvailable
    ? `${teamsJoined} / ${slotsAvailable}`
    : teamsJoined;

  const getTimestampAndLabel = (): { timestamp: string | JSX.Element, label?: string } => {
    switch(tournamentStatus) {
      case 'NOT STARTED':
        return {
          timestamp: formatDateTimeStringRelativeToNow(new Date(startAt)),
          label: 'Start time',
        }
      case 'STARTED':
        return {
          timestamp: <HookTimer secondsCountdown={differenceInSeconds(new Date(endsAt), Date.now())} />,
          label: 'until scoring closes',
        }
      case 'COMPLETE':
        return { timestamp: 'Tournament ended' }
      case 'PENDING RESULTS':
        return { timestamp: 'Scoring closed' }
      case 'PENDING PAYOUT':
        return { timestamp: 'Scoring closed' }
      default:
        return { timestamp: 'Tournament ended' }
  }
  }

  const timestampData = getTimestampAndLabel();

  return (
    <Wrapper>
      <JoinedTeamsButton onClick={openTeamsModal}>
        <PrimaryText>{teamsString}</PrimaryText>
        <JoinedWrapper>
          <SecondaryText>Teams joined</SecondaryText>
          <ChevronIcon icon="action:chevronRight" />
        </JoinedWrapper>
      </JoinedTeamsButton>

      <Container>
        <PrimaryText>
          {timestampData.timestamp}
        </PrimaryText>
        <StartTime>{timestampData?.label}</StartTime>
      </Container>
    </Wrapper>
  );
};

export default TournamentHeader;
