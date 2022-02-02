import ParticipantTarget from '.';

const mockTargetUp = {
  score: 12,
  scoreType: 'kills',
  scoreToPlaceDifference: 11,
  direction: 'UP',
  position: 4,
  prize: {
    prizeType: 'currency',
    value: 200,
  },
}

const mockTargetDown = {
  score: 12,
  scoreType: 'kills',
  scoreToPlaceDifference: 11,
  direction: 'DOWN',
  position: 4,
  prize: {
    prizeType: 'currency',
    value: 200,
  },
}

export const participantTargetUp = (): JSX.Element => (
  <ParticipantTarget target={mockTargetUp} />
);

export const participantTargetDown = (): JSX.Element => (
  <ParticipantTarget target={mockTargetDown} />
);

export default {
  title: 'Components/Organisms/Live Scoreboard/Participant Target',
  component: participantTargetUp,
};
