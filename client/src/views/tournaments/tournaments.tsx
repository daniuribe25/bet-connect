import { useEffect } from 'react';
import styled from 'styled-components';
import { fontMediumLarge } from 'styles/typography';
import AllTournaments from 'components/organisms/all-tournaments';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTournaments } from 'redux/actions/tournaments-actions';
import { RootState } from 'redux/root-reducer';
import useInterval from 'helpers/use-interval';

const Header = styled.h1`
  color: ${({ theme }) => theme.dark.text.primary};
  ${fontMediumLarge};
  margin: 0;
  background-color: #031725;
  position: absolute;
  padding: 16px;
  width: 100%;
  z-index: 2;
`;

const TournamentsWrapper = styled.div`
  margin-top: 62px;
  padding: 0 16px;
`;

const Tournaments = (): JSX.Element => {
  const {
    tournaments
  } = useSelector(({ tourneys }: RootState) => tourneys);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllTournaments());
  }, [dispatch]);

  useInterval(() => {
    dispatch(getAllTournaments());
  }, 30000);

  return (
    <div>
      <Header>Tournaments</Header>
      <TournamentsWrapper>
        <AllTournaments tournaments={tournaments} />
      </TournamentsWrapper>
    </div>
  )
}

export default Tournaments;
