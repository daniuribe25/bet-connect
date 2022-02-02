import { useContext, useState } from 'react';
import styled from 'styled-components';
import Pill from 'components/core/pill';
import { ModalContext } from 'util/modal-context/modal-context';
import { fontMediumLarge, fontMediumSmall, fontSmall } from 'styles/typography';
import { CenterSpinner } from 'components/core/loading-spinner';
import formatMoney from 'helpers/format-money';

const PillsWrapper = styled.div`
  display: flex;

  > :first-child {
    margin-right: 8px;
  }
`;

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.light.background.primary};
  padding: 16px;
`;

const Header = styled.h1`
  ${fontMediumLarge};
  margin: 0;
  color: ${({ theme }) => theme.light.text.primary};
`;

const SubText = styled.div`
  color: ${({ theme }) => theme.light.text.secondary};
  ${fontMediumSmall};
  font-weight: 400;
  margin-top: 4px;
`

const Details = styled.div`
  ${fontSmall};
  color: ${({ theme }) => theme.light.text.primary};
  margin: 16px 0;
`;

const Banner = styled.div`
  padding: 16px;
  background-color: #F6BB43;
  color: ${({ theme }) => theme.light.text.primary};
  border-radius: 8px;
  margin-bottom: 16px;
  ${fontSmall};
`;

type ConfirmEntryModalType = {
  joinedTournamentAction: () => void;
  entryFeeValue: number;
  totalPrizePool: number;
  numberOfPlayersEntering: number;
  gameString: string;
}

export const ConfirmTournamentEntryModal = ({
  joinedTournamentAction,
   entryFeeValue,
   totalPrizePool,
   numberOfPlayersEntering,
   gameString,
}: ConfirmEntryModalType): JSX.Element => {
  const context = useContext(ModalContext);
  const [loading, setLoading] = useState(false);
  return (
    <ContentWrapper>
      <Header>Confirm {formatMoney({ amount: entryFeeValue })} entry</Header>
      <SubText>Total prize: {formatMoney({ amount: totalPrizePool })}</SubText>
      <Details>You’re entering this tournament with <strong>{numberOfPlayersEntering} players</strong>.</Details>
      <Banner>
        You are entering a <strong>{gameString}</strong> tournament. You must play this <strong>exact format</strong> in Warzone or your entries will not count.
      </Banner>
      <PillsWrapper>
        <Pill onClick={context?.dismissModal} variant="info">Cancel</Pill>
        <Pill
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            await joinedTournamentAction();
            context?.dismissModal();
          }}
          variant="success"
        >
          {loading ? (
            <CenterSpinner size={20} />
          ) : (
            'Confirm'
          )}
        </Pill>
      </PillsWrapper>
    </ContentWrapper>
  )
}

export const CancelTournamentEntryModal = ({ cancelTournamentEntry, entryFeeValue }: { cancelTournamentEntry: () => void, entryFeeValue: number }): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const context = useContext(ModalContext);
  return (
    <ContentWrapper>
      <Header>Cancel team entry?</Header>
      <Details><strong>All players in your team</strong> will leave this tournament and you will each be refunded {formatMoney({ amount: entryFeeValue })}</Details>
      <PillsWrapper>
        <Pill onClick={context?.dismissModal} variant="info">
          Cancel
        </Pill>
        <Pill
          onClick={async () => {
            setLoading(true);
            await cancelTournamentEntry();
            context?.dismissModal();
          }}
          variant="warning">
           {loading ? (
            <CenterSpinner size={20} />
          ) : (
            'Leave'
          )}
        </Pill>
      </PillsWrapper>
    </ContentWrapper>
  )
}
