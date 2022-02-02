import { useEffect } from 'react';
import styled from 'styled-components';
import { getUserTournamentHistory } from 'redux/actions/tournaments-actions';
import { RootState } from 'redux/root-reducer';
import AllTournaments from 'components/organisms/all-tournaments';
import { useDispatch, useSelector } from 'react-redux';

const TournamentsWrapper = styled.div`
  padding: 16px;
`;

const TournamentHistory = (): JSX.Element => {
  const dispatch = useDispatch();

  const { userTournamentHistory } = useSelector(
    ({ tourneys }: RootState) => tourneys,
  );

  useEffect(() => {
    dispatch(getUserTournamentHistory());
  }, [dispatch]);

  return (
    <TournamentsWrapper>
      <AllTournaments tournaments={userTournamentHistory || []} />
    </TournamentsWrapper>
  )
}

export default TournamentHistory;
