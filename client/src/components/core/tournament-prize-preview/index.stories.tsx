
import mockDivisions from 'components/core/all-results/mock-divisions';
import TournamentPrizePreview from '.';

export const tournamentPrizePreviewDivisions = (): JSX.Element => (
  <TournamentPrizePreview
    totalPrizePool={1000}
    openAllResultsModal={() => {}}
    openAllPrizesModal={() => {}}
    teams={[]}
    hasDivisions
    tournamentDivisions={mockDivisions.divisions}
    prizeStyle="Placement"
    tournamentStatus="COMPLETE"
    payouts={[]}
  />
);

export default {
  title: 'Components/Core/Tournament Prize Preview',
  component: tournamentPrizePreviewDivisions,
};
