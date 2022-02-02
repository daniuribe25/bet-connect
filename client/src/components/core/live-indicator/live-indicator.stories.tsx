import LiveIndicator from ".";

export const live = (): JSX.Element => (
  <LiveIndicator tournamentStatus="STARTED" />
);

export const complete = (): JSX.Element => (
  <LiveIndicator tournamentStatus="COMPLETE" />
);

export const inReview = (): JSX.Element => (
  <LiveIndicator tournamentStatus="PENDING PAYOUT" />
);

export const cancelled = (): JSX.Element => (
  <LiveIndicator tournamentStatus="CANCELLED" />
);

export default {
  title: 'Components/Core/Live indicator',
  component: live,
};
