import { useHistory } from 'react-router-dom';
import TournamentPrize from 'components/core/tournament-prize';
import LiveIndicator from 'components/core/live-indicator';
import { formatDateTimeStringRelativeToNow, withinHour } from 'helpers/date-time';
import getTeamMode from 'helpers/get-team-mode';
import { Tournament } from 'helpers/pl-types';
import {
  TournamentCardWrap,
  TournamentName,
  HalfSection,
  SecondaryText,
  RightHalfSection,
  ScoreFormat,
} from './index.styles';
import TournamentLabel from './tournament-label';

const TournamentCard = ({
  tournament,
}: {
  tournament: Tournament;
}): JSX.Element => {
  const history = useHistory();

  const {
    id,
    totalTeams,
    tournamentConfig: {
      configJson: {
        entryFeeValue,
        maximumNumberTeams,
        startDateTime,
        totalPrizePool,
        scoringStyle,
        prizeStyle,
        hasDivisions,
        gameInfo: { gameModeName, gameModeOptions },
      },
    },
    tournamentTeams,
    tournamentStatus,
    userFlag,
  } = tournament;

  const teamSize = gameModeOptions?.teamSizes?.[0];
  const titleString = `${gameModeName} ${getTeamMode(teamSize)}`;

  const tournamentCardOnClick = (): void => {
    history.push(`/tournament/${id}`);
  };

  const teamsJoined = maximumNumberTeams
    ? `${totalTeams} / ${maximumNumberTeams} teams joined`
    : `${totalTeams} teams joined`;

  const date = new Date(startDateTime);

  const formattedString = formatDateTimeStringRelativeToNow(date);

  const timeString = withinHour(date) ? `Starts in ${formattedString}` : formattedString;

  const usersTeam = tournamentTeams?.find((team) => team?.isUsersTeam === true);

  return (
    <TournamentCardWrap onClick={tournamentCardOnClick}>
      <HalfSection>
        <div>
          <TournamentName>{titleString}</TournamentName>
          <ScoreFormat>{scoringStyle}</ScoreFormat>
          <TournamentLabel userFlag={userFlag} entryFee={entryFeeValue} tournamentStatus={tournamentStatus} usersTeam={usersTeam} />
        </div>
        <SecondaryText>{teamsJoined}</SecondaryText>
      </HalfSection>
      <RightHalfSection>
        <TournamentPrize
          hasDivisions={hasDivisions}
          prizePool={totalPrizePool}
          prizeStyle={prizeStyle.charAt(0).toUpperCase() + prizeStyle.slice(1)}
        />
        {tournamentStatus === 'NOT STARTED' ? (
          <SecondaryText>{timeString}</SecondaryText>
        ) : (
          <LiveIndicator tournamentStatus={tournamentStatus} />
        )}
      </RightHalfSection>
    </TournamentCardWrap>
  );
};

export default TournamentCard;
