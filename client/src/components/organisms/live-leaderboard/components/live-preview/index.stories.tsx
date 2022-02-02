import LivePreview from '.';

export const livePreview = (): JSX.Element => (
  <LivePreview timer={{ seconds: 300000, percentage: 100, minAgo: 1 }} endDateTime="2022-01-10T19:05:00.000Z" />
);

export default {
  title: 'Components/Organisms/Live Scoreboard/Live Preview',
  component: livePreview,
};
