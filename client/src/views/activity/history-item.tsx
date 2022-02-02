import styled from 'styled-components';
import moment from 'moment';
import { HistoryStatus } from 'components/history-status';
import { GameStatus, HistoryItemProps } from 'helpers/pl-types';
import TeamAvatars from 'components/core/team-avatars';
import { fontMediumSmall, fontSmall } from 'styles/typography';

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RightColumn = styled(LeftColumn)`
  align-items: flex-end;
`;

const ItemWrapper = styled.div<{ itemIsCurrentBet: boolean }>`
  background-color: ${({ theme }) => theme.dark.background.primary};
  border: ${({ itemIsCurrentBet }) => itemIsCurrentBet ? '2px solid #23ca78' : 'none'};
  display: flex;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
  cursor: pointer;
  justify-content: space-between;
  height: 110px;
`;

const GameName = styled.div`
  color: ${({ theme }) => theme.dark.text.primary};
  ${fontMediumSmall};
`;

const BetAmount = styled.div`
  color: ${({ theme }) => theme.dark.text.primary};
  ${fontSmall};
  margin-top: 4px;
`;

const BetDate = styled.div`
  color: ${({ theme }) => theme.dark.text.alternative};
  ${fontSmall};
`;

const HistoryItem = (props: HistoryItemProps): JSX.Element => {
  const {
    game,
    date,
    onClick,
    state,
    team,
    id,
    index,
    currentBet,
    tasks,
  } = props;

  let betAmount = 0;
  tasks.forEach((m) => {
    betAmount += m.betAmount;
  });

  const cardOnClick = (): void => {
    onClick(props);
  }

  const dateString = moment.utc(date).local().format('hh:mm a MMM Do YYYY');

  const itemIsCurrentBet = index === 0 && state === GameStatus.WAITING && currentBet === id;

  return (
    <ItemWrapper
      itemIsCurrentBet={itemIsCurrentBet}
      onClick={cardOnClick}
      onKeyPress={cardOnClick}
      role="button"
      tabIndex={0}
      id={id}
    >
      <LeftColumn>
        <div>
          <GameName>{game}</GameName>
          <BetAmount>{`$${betAmount.toFixed(2)}`}</BetAmount>
        </div>
        <BetDate>{dateString}</BetDate>
      </LeftColumn>

      <RightColumn>
        <HistoryStatus {...props} />
        <TeamAvatars team={team} />
      </RightColumn>
    </ItemWrapper>
  );
};

export default HistoryItem;
