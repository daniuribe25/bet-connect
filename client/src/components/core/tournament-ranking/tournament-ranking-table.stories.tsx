import { RowProps } from './types';
import TournamentRankingTable from './tournament-ranking-table';

const empty: Array<RowProps> = [{
  placement: 1,
  prize: "$5000"

},
{
  placement: 2,
  prize: "$1000"
},
{
  placement: 3,
  prize: "$500"
},
{
  placement: 4,
  prize: "$100"
},
{
  placement: 5,
  prize: ""
}]

const data: Array<RowProps> = [{
  placement: 1,
  prize: "$5000",
  team: "Robot",
  score: '60',
  teamIsInTheMoney: true,
},
{
  placement: 2,
  prize: "$1000",
  team: "Alien",
  score: '58',
  teamIsInTheMoney: true,
},
{
  placement: 3,
  prize: "$500",
  team: "Monster",
  score: '12',
  teamIsInTheMoney: true,
},
{
  placement: 4,
  prize: "$100",
  team: "Mutant",
  score: '9',
  teamIsInTheMoney: true,
},
{
  placement: 5,
  prize: "",
  team: "Human",
  score: '5',
  isCurrentUser: true,
  teamIsInTheMoney: false,
}]

export const tournamentRankingTableEmpty = (): JSX.Element => (
  <TournamentRankingTable data={empty} />
);

export const tournamentRankingTableData = (): JSX.Element => (
  <TournamentRankingTable data={data} />
);

export default {
  title: 'Components/Core/Tournament Ranking Table',
  component: tournamentRankingTableData,
};
