import TournamentCard from 'components/core/tournament-card';
import styled from 'styled-components';
import { fontMediumSmall } from 'styles/typography';
import { Tournament } from 'helpers/pl-types';

const NoTournaments = styled.div`
  ${fontMediumSmall};
  text-align: center;
  padding-top: 48px;
  color: ${({ theme }) => theme.dark.text.secondary};
`;

type AllTournamentsTypes = {
  tournaments: Tournament[];
}

const AllTournaments = ({ tournaments }: AllTournamentsTypes): JSX.Element => {
  return (
    <div>
      {tournaments.length >= 1 ? (
        tournaments?.map((tournament) => {
          return (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
            />
          )
        })
      ) : (
        <NoTournaments>No tournaments available</NoTournaments>
      )}
    </div>
  );
};

export default AllTournaments;
