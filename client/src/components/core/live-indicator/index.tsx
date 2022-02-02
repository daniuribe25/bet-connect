import SVG from 'assets/images/svgs';
import { tournamentStatuses } from 'helpers/pl-types';
import styled from 'styled-components';
import { fontSmall } from 'styles/typography';

const LiveSvg = styled(SVG)`
  height: 14px;
  width: 14px;
  margin-right: 3px;
  fill: ${({ theme }) => theme.dark.icon.primary};
`;

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  ${fontSmall};
  color: ${({ theme }) => theme.dark.text.alternative};
`;

const LiveIndicator = ({ tournamentStatus }: { tournamentStatus: tournamentStatuses }): JSX.Element => {
  return (
    <>
      {tournamentStatus === 'COMPLETE' && (
        <Container>Ended</Container>
      )}
      {tournamentStatus === 'CANCELLED' && (
        <Container>Cancelled</Container>
      )}
      {tournamentStatus === 'PENDING PAYOUT' && (
        <Container>In review</Container>
      )}
      {tournamentStatus === 'PENDING RESULTS' && (
        <Container>In review</Container>
      )}
      {tournamentStatus === 'STARTED' && (
        <Container>
          <LiveSvg icon="content:live" position="static"/> Live
        </Container>
      )}
    </>
  );
};

export default LiveIndicator;
