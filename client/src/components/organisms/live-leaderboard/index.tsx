import { useEffect, useState, useContext } from 'react';
import { ModalContext } from 'util/modal-context/modal-context';
import { Tournament } from 'helpers/pl-types';
import useInterval from 'helpers/use-interval';
import updateScoreboardTeamsDisplayed from './helpers';
import ParticipantTarget from './components/participant-target';
import LivePreview from './components/live-preview';
import ParticipantCurrentPosition from './components/participant-current-position';
import { Scoreboard } from './components/score-board';
import {
  Wrapper,
  UserPositionWrapper,
  TargetWrapper,
  ViewAllScoresWrapper,
  ScoreboardWrapper,
} from './index.styles';

const INTERVAL = 300000;

const LiveLeaderboard = ({ tournament }: { tournament: Tournament }): JSX.Element => {
  const context = useContext(ModalContext);
  const defaultTimer = { seconds: INTERVAL, percentage: 100, minAgo: 1 };
  const [timer, setTimer] = useState(defaultTimer);

  useInterval(() => {
    setTimer(defaultTimer);
    // TODO: add api call
  }, INTERVAL);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSeconds = timer.seconds - 1000;
      const newPercentage = (newSeconds * 100) / INTERVAL;
      const newMin = Math.floor((INTERVAL - newSeconds) / 60000);
      setTimer({
        seconds: newSeconds,
        percentage: newPercentage,
        minAgo: newMin
      })
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const {
    divisions,
    tournamentConfig: {
      configJson: {
        hasDivisions,
        endDateTime,
      }
    },
    tournamentTeams,
  } = tournament;

  const teamsToDisplay = hasDivisions ? divisions?.[0]?.divisionTeams : tournamentTeams;

  const usersTeam = teamsToDisplay?.find((team) => team?.isUsersTeam === true);

  const filteredTeams = updateScoreboardTeamsDisplayed(teamsToDisplay);

  const openViewAllScoresModal = (): void => {
    context?.displayModal({
      modalDisplayed: true,
      type: 'fullscreen',
      modalTitle: 'All scores',
      body: (
        <Scoreboard tournamentTeams={teamsToDisplay || []} />
      ),
    });
  }

  return (
    <Wrapper>
      <LivePreview timer={timer} endDateTime={endDateTime} />
      {usersTeam && (
        <UserPositionWrapper>
          <ParticipantCurrentPosition
            prize={usersTeam?.payoutObject}
            position={5}
            teamIsInTheMoney={usersTeam?.teamIsInTheMoney || false}
          />
        </UserPositionWrapper>
      )}
      {usersTeam && (
      <TargetWrapper>
        <ParticipantTarget target={usersTeam?.target} />
      </TargetWrapper>
      )}
      <ScoreboardWrapper>
        <Scoreboard tournamentTeams={filteredTeams || []} />
      </ScoreboardWrapper>
      <ViewAllScoresWrapper onClick={openViewAllScoresModal}>View all scores</ViewAllScoresWrapper>
    </Wrapper>
  )
}

export default LiveLeaderboard;
