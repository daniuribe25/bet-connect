import { useEffect, useContext } from 'react';
import { ModalContext } from 'util/modal-context/modal-context';
import styled from 'styled-components';
import { useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/root-reducer';
import { getBetHistory } from 'redux/actions/lobby-actions';
import HistoryDetails from './history-details';
import HistoryItem from './history-item';
import buildHistory from './helpers';

const PageWrapper = styled.div`
  padding: 16px;
`;

const Bets = (): JSX.Element => {
  const dispatch = useDispatch();
  const apollo = useApolloClient();
  const { userBetHistory } = useSelector(
    ({ lobby }: RootState) => lobby,
  );

  useEffect(() => {
    dispatch(getBetHistory({ apollo }));
  }, []);

  const historyData = buildHistory(userBetHistory);

  const context = useContext(ModalContext);

  return (
    <PageWrapper>
      {historyData.length ? (
        historyData.map((bet, index) => (
          <HistoryItem
            {...bet}
            onClick={() => {
              context?.displayModal({
                modalDisplayed: true,
                type: 'fullscreen',
                modalTitle: bet.game,
                body: <HistoryDetails {...bet} />,
              });
            }}
            key={`${bet.id}game`}
            index={index}
            currentBet={false}
          />
        ))
        ) : (
        <p>
          {"You don't have a bet history yet. Play some matches!"}
        </p>
      )}
    </PageWrapper>
  )
}

export default Bets;
