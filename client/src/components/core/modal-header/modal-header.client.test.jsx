import { render } from 'unit-test-utils';
import ModalHeader from '.';

test('renders modal header with title and no buttons', () => {
  const { getByText, getByTestId } = render(
    <ModalHeader title="Modal header title" />
  );
  expect(getByText('Modal header title')).toBeInTheDocument();

  expect(() => getByTestId('modal-header-back-button')).toThrow();
  expect(() => getByTestId('modal-header-close-button')).toThrow();
});

test('renders back and close button', () => {
  const { getByTestId } = render(
    <ModalHeader title="Modal header title" backOnClick={() => {}} closeOnClick={() => {}} />
  );

  expect(getByTestId('modal-header-back-button')).toBeInTheDocument();
  expect(getByTestId('modal-header-close-button')).toBeInTheDocument();
});
