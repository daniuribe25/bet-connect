import moment from 'moment';
import BottomInfoBar from '../bottom-info-bar';
import { RowProps, Rankings } from './types';
import {
  Table,
  TableRow,
  Placement,
  Score,
  Prize,
  TeamName,
  PreviewWrapper,
} from './index.styles';

const Row = ({
  placement,
  team,
  score,
  prize,
  isCurrentUser = false,
  teamIsInTheMoney,
}: RowProps): JSX.Element => {
  const teamPlacement = moment.localeData().ordinal(Number(placement));
  return (
    <TableRow highlighted={isCurrentUser}>
      <div>
        <Placement teamIsInTheMoney={teamIsInTheMoney}>{teamPlacement}</Placement>
        <TeamName>{team}</TeamName>
      </div>
      <div>
        <Score>{score}</Score>
        <Prize teamIsInTheMoney={teamIsInTheMoney}>{prize}</Prize>
      </div>
    </TableRow>
  );
};

const YourTeamResultsBottomBar = ({ data }: Rankings): JSX.Element => {
  const currentUserTeamResults: RowProps | undefined = data?.find(
    (tournamentPlacementObject: any) => tournamentPlacementObject.isCurrentUser,
  );

  return (
    <>
      {currentUserTeamResults ? (
        <BottomInfoBar variant="dark">
          <Row
            key={`${currentUserTeamResults.placement}-${currentUserTeamResults.team}`}
            placement={currentUserTeamResults.placement}
            team={`${currentUserTeamResults.team}`}
            score={currentUserTeamResults.score}
            prize={currentUserTeamResults.prize}
            teamIsInTheMoney={currentUserTeamResults.teamIsInTheMoney}
          />
        </BottomInfoBar>
      ) : undefined}
    </>
  );
};

const TournamentRankingPreview = ({ data }: Rankings): JSX.Element  => (
  <PreviewWrapper>
    <Table>
      {data?.map(({ placement, team, score, prize, isCurrentUser, teamIsInTheMoney }) => {
        return (
          <Row
            key={`${placement}-${team}`}
            placement={placement}
            team={team}
            score={score}
            prize={prize}
            isCurrentUser={isCurrentUser}
            teamIsInTheMoney={teamIsInTheMoney}
          />
        );
      })}
    </Table>

    <YourTeamResultsBottomBar data={data} />
  </PreviewWrapper>
);

export default TournamentRankingPreview;
