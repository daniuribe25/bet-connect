import { TournamentTeam, PayoutAmounts, DivisionType, tournamentStatuses } from 'helpers/pl-types';
import formatMoney from "helpers/format-money";
import TournamentRankingTable from "./tournament-ranking-table";
import { RowProps } from "./types";

const remapTeamForTable = (teams: TournamentTeam[]): RowProps[] => {
  return teams.map(({ teamName, placement, payoutObject, teamPrimaryMetricTotal, teamIsInTheMoney }): RowProps => {
    return {
      placement,
      team: teamName,
      score: teamPrimaryMetricTotal,
      prize: payoutObject?.value && formatMoney({ amount: payoutObject?.value }),
      teamIsInTheMoney,
    }
  })
}

const remapPayoutsForTable = (payouts: PayoutAmounts[]): RowProps[] => {
  return payouts.map(({  placement, value }): RowProps => {
    return {
      placement,
      prize: value ? formatMoney({ amount: value }) : undefined
    }
  })
}

type RankingPreview = {
  tournamentStatus: tournamentStatuses;
  payouts: Array<PayoutAmounts>;
  teams?: Array<TournamentTeam>;
  tournamentDivisions: DivisionType[];
  hasDivisions: boolean;
}

const TournamentRankingPreview = ({ tournamentStatus, payouts, teams, tournamentDivisions, hasDivisions }: RankingPreview): JSX.Element => {

  if (tournamentStatus === 'COMPLETE' && hasDivisions) {
    const usersDivision = tournamentDivisions.find((division) => {
      return division.divisionTeams.find((x) => x.isUsersTeam)
    })

    const subsetTeams = usersDivision?.divisionTeams?.slice(0,3) || [];

    const mappedTeams = remapTeamForTable(subsetTeams);

    return <TournamentRankingTable data={mappedTeams} />
  }

  if (tournamentStatus === 'COMPLETE' && teams) {
    const subsetTeams = teams?.slice(0,3);

    const mappedTeams = remapTeamForTable(subsetTeams);

    return <TournamentRankingTable data={mappedTeams} />
  }

  const subsetPayouts = payouts?.slice(0,3);

  const mappedPayouts = remapPayoutsForTable(subsetPayouts);

  return <TournamentRankingTable data={mappedPayouts} />
}

export default TournamentRankingPreview;
