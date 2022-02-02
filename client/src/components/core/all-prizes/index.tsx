import { PayoutAmounts } from 'helpers/pl-types';
import formatMoney from 'helpers/format-money';
import { RowProps } from '../tournament-ranking/types';
import TournamentRankingTable from '../tournament-ranking/tournament-ranking-table';

const remapPayoutsForTable = (payouts: PayoutAmounts[]): RowProps[] => {
  return payouts.map(
    ({ placement, value }): RowProps => {
      return {
        placement,
        prize: value ? formatMoney({ amount: value }) : undefined,
      };
    },
  );
};

const AllPrizes = ({ prizes }: { prizes: PayoutAmounts[] }): JSX.Element => {
  const mappedPrizes = remapPayoutsForTable(prizes);
  return (
    <>
      <TournamentRankingTable data={mappedPrizes} />
    </>
  );
};

export default AllPrizes;
