import TeamAvatars from '.';

export const teamAvatars = (): JSX.Element => (
  <TeamAvatars
    team={[
      { playerTag: 'taco' },
      { playerTag: 'cheese' },
      { playerTag: 'lettuce' },
      { playerTag: 'hotsauce' }
    ]}
  />
);


export default {
  title: 'Components/Core/Team Avatars',
  component: teamAvatars,
};
