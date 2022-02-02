import { render, fireEvent, waitFor } from 'unit-test-utils';
import { ConfirmTournamentEntryModal, CancelTournamentEntryModal } from '.';

test('can render confirm modal and click buttons', async () => {
  const mockJoinTournamentAction = jest.fn();
  const { getByText } = render((
    <ConfirmTournamentEntryModal
      numberOfPlayersEntering={4}
      joinedTournamentAction={mockJoinTournamentAction}
      entryFeeValue={5}
      totalPrizePool={250}
      gameString="Verdansk Duos"
    />
  ));

  expect(getByText('Confirm $5 entry')).toBeInTheDocument();
  expect(getByText('Total prize: $250')).toBeInTheDocument();
  expect(getByText('Confirm')).toBeInTheDocument();
  expect(getByText('Cancel')).toBeInTheDocument();

  await waitFor(() => {
    fireEvent.click(getByText('Confirm'))
  });

  expect(mockJoinTournamentAction).toHaveBeenCalled();
});

test('can render cancel entry modal and click buttons', async () => {
  const mockCancelTournamentEntry = jest.fn();
  const { getByText } = render((
    <CancelTournamentEntryModal
    cancelTournamentEntry={mockCancelTournamentEntry}
    entryFeeValue={5}
    />
  ));

  expect(getByText('Cancel team entry?')).toBeInTheDocument();
  expect(getByText('Leave')).toBeInTheDocument();
  expect(getByText('Cancel')).toBeInTheDocument();

  await waitFor(() => {
    fireEvent.click(getByText('Leave'))
  });

  expect(mockCancelTournamentEntry).toHaveBeenCalled();
});

