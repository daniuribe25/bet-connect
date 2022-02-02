import styled from 'styled-components';
import SVG from 'assets/images/svgs';
import TournamentPrize from 'components/core/tournament-prize';
import { TournamentTeam, PayoutAmounts, DivisionType, tournamentStatuses } from 'helpers/pl-types';
import TournamentRankingPreview from '../tournament-ranking/tournament-ranking-preview';

const DetailsWrapper = styled.div`
  background-color: ${({ theme }) => theme.dark.background.primary};
  margin-bottom: 16px;
  border-radius: 8px;
`;

const Header = styled.div`
  height: 88px;
  border-bottom: solid 1px #104A77;
  padding: 8px 16px;
  padding-left: 8px;
  display: flex;
  justify-content: space-between;
`;

const Trophy = styled(SVG)`
  position: relative;
  top: -15px;
`;

const ViewRankingsCTA = styled.div`
  height: 48px;
  border-top: solid 1px #104A77;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2F9BD8;
  cursor: pointer;
`;

const TournamentPrizePreview = ({
  openAllResultsModal,
  openAllPrizesModal,
  teams,
  payouts,
  tournamentStatus,
  totalPrizePool,
  prizeStyle,
  hasDivisions,
  tournamentDivisions,
}: {
  totalPrizePool: number,
  openAllResultsModal: () => void,
  openAllPrizesModal: () => void,
  teams?: TournamentTeam[],
  payouts: PayoutAmounts[],
  tournamentStatus: tournamentStatuses,
  prizeStyle: string,
  hasDivisions: boolean,
  tournamentDivisions: DivisionType[];
}): JSX.Element => {
  return (
    <DetailsWrapper>
      <Header>
        <Trophy icon={"content:trophyMarketing"} />
        <TournamentPrize
          hasDivisions={hasDivisions}
          prizePool={totalPrizePool}
          prizeStyle={prizeStyle.charAt(0).toUpperCase() + prizeStyle.slice(1)} />
      </Header>
      <TournamentRankingPreview
        tournamentStatus={tournamentStatus}
        payouts={payouts}
        teams={teams}
        tournamentDivisions={tournamentDivisions}
        hasDivisions={hasDivisions}
      />
      {tournamentStatus === 'COMPLETE' ?
        (<ViewRankingsCTA onClick={openAllResultsModal}>
        View all results
      </ViewRankingsCTA>
      ) : (<ViewRankingsCTA onClick={openAllPrizesModal}>
        View all prizes
      </ViewRankingsCTA>)}
    </DetailsWrapper>
  )
};

export default TournamentPrizePreview;
