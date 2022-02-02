import { ConfirmTournamentEntryModal, CancelTournamentEntryModal } from '.';

export const confirmTournamentEntryModal = (): JSX.Element => (
  <ConfirmTournamentEntryModal
    numberOfPlayersEntering={4}
    joinedTournamentAction={() => {}}
    entryFeeValue={5}
    totalPrizePool={250}
    gameString="Verdansk Duos"
  />
);

export const cancelTournamentEntryModal = (): JSX.Element => (
  <CancelTournamentEntryModal
    cancelTournamentEntry={() => {}}
    entryFeeValue={5}
  />
);

export default {
  title: 'Components/Core/Tournament Confirmation Modals',
  component: confirmTournamentEntryModal,
};
