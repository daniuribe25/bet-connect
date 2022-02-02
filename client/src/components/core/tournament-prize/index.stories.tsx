import TournamentPrize from '.';

export const tournamentPrize = (): JSX.Element => (
  <TournamentPrize
    prizePool={500}
    prizeStyle="Placement"
    hasDivisions={false}
  />
);

export const tournamentPrizeHasDivisions = (): JSX.Element => (
  <TournamentPrize
    hasDivisions
    prizeStyle="Placement"
    prizePool={500}
  />
);

export default {
  title: 'Components/Core/Tournament Prize',
  component: tournamentPrize,
};
