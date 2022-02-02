import ParticipantCurrentPosition from '.';

export const participantCurrentPositionInTheMoney = (): JSX.Element => (
  <ParticipantCurrentPosition
    prize={{ value: 100, type: 'currency', isApproved: false }}
    position={4}
    teamIsInTheMoney
  />
);

export const participantCurrentPositionNotInTheMoney = (): JSX.Element => (
  <ParticipantCurrentPosition
    prize={{ value: 0, type: 'currency', isApproved: false }}
    position={12}
    teamIsInTheMoney={false}
  />
);

export default {
  title: 'Components/Organisms/Live Scoreboard/Participant Current Position',
  component: participantCurrentPositionInTheMoney,
};
