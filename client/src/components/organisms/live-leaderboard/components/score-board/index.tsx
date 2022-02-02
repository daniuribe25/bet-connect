import moment from 'moment';
import formatMoney from 'helpers/format-money';
import { TournamentTeam } from 'helpers/pl-types';
import {
  Row,
  MainText,
  SecondaryText,
  RightSection,
} from './index.styles';

export const ScoreboardRow = ({ tournamentTeam }: { tournamentTeam: TournamentTeam }): JSX.Element => {
  const {
    teamName,
    teamPrimaryMetricTotal,
    payoutObject,
    placement,
    isUsersTeam,
    teamIsInTheMoney,
  } = tournamentTeam;

  const currentWinningsString = formatMoney({ amount: payoutObject?.value || 0 });
  const teamPlacement = moment.localeData().ordinal(Number(placement));
  return (
    <Row isUsersTeam={isUsersTeam} teamIsInTheMoney={teamIsInTheMoney}>
      <div>
        <MainText>{isUsersTeam ? 'Your team' : teamName}</MainText>
        <SecondaryText isUsersTeam={isUsersTeam} teamIsInTheMoney={teamIsInTheMoney}>
          {teamPlacement}
        </SecondaryText>
      </div>

      <RightSection>
        <MainText>{teamPrimaryMetricTotal}</MainText>
        <SecondaryText isUsersTeam={isUsersTeam} teamIsInTheMoney={teamIsInTheMoney}>
          {currentWinningsString}
        </SecondaryText>
      </RightSection>
    </Row>
  )
}

export const Scoreboard = ({ tournamentTeams }: { tournamentTeams: Array<TournamentTeam> }): JSX.Element => {
  return (
    <div>
      {tournamentTeams.map((tournamentTeam) => {
        return (
          <ScoreboardRow key={tournamentTeam.id} tournamentTeam={tournamentTeam} />
        )
      })}
    </div>
  )
}
