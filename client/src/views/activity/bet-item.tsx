import styled from 'styled-components';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import { GameStatus } from 'helpers/pl-types';
import { fontMediumSmall, fontSmall } from 'styles/typography';

export interface BetItemProps {
  id: string;
  title: string;
  subtitle?: string;
  betAmount: number;
  returnAmount: number;
  addToBet?: (id: string) => void;
  added: boolean;
  won?: boolean;
  state?: string;
}

const BetItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const ColumnRight = styled.div`
  text-align: right;
`;

const AddButton = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.success.text.secondary};
  svg {
    position: relative;
    top: 7px;
  }
`;

const Header = styled.div`
  ${fontMediumSmall};
`;

const SecondaryText = styled.div`
  ${fontSmall};
  color: ${({ theme }) => theme.dark.text.secondary};
`;

const TopSection = styled.div<{ inactive: boolean }>`
  display: flex;
  justify-content: space-between;
  opacity: ${({ inactive }) => inactive ? 0.5 : 1};
`;

export const BetItem = ({
  id,
  title,
  subtitle,
  betAmount,
  returnAmount,
  addToBet,
  added,
  state,
  won,
}: BetItemProps): JSX.Element => {
  const displayWinText = (state === GameStatus.WAITING) || (state === GameStatus.COMPLETE && won);
  return (
    <BetItemWrapper id={id}>
      <TopSection inactive={!added}>
        <Header>{title}</Header>
        <Header>{`Bet $${betAmount.toFixed(2)}`}</Header>
      </TopSection>
      <TopSection inactive={!added}>
        <SecondaryText>{subtitle}</SecondaryText>
        {state ? (
          <ColumnRight>
            {displayWinText && (
              <SecondaryText>{`Win $${returnAmount.toFixed(2)}`}</SecondaryText>
            )}
            {state === GameStatus.COMPLETE && !won && (
              <SecondaryText>Lost</SecondaryText>
            )}
          </ColumnRight>
        ) : (
          <ColumnRight>{`Win $${(betAmount + returnAmount).toFixed(2)}`}</ColumnRight>
        )}
      </TopSection>
      {!added && (
        <AddButton
          onClick={() => addToBet && addToBet(id)}
          onKeyPress={() => addToBet && addToBet(id)}
          tabIndex={0}
          role="button"
        >
          Add to betslip <ControlPointIcon />
        </AddButton>
      )}
    </BetItemWrapper>
  )
};
