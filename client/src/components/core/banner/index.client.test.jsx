import { render, fireEvent } from 'unit-test-utils';
import { Toast, Banner } from '.';

test('calls dismissFunction when clickToDismiss is true', () => {
  const dismissToast = jest.fn();

  const { getByTestId } = render(
    <Toast toastData={{ clickToDismiss: true }} dismissToast={dismissToast} />,
  );

  fireEvent.click(getByTestId('global-toast-dismissable-area'));
  expect(dismissToast).toHaveBeenCalledTimes(1);
});

test('calls dismissFunction when closeButton is true', () => {
  const dismissToast = jest.fn();

  const { getByTestId } = render(
    <Toast toastData={{ closeButton: true }} dismissToast={dismissToast} />,
  );

  fireEvent.click(getByTestId('global-toast-close-btn'));
  expect(dismissToast).toHaveBeenCalledTimes(1);
});

test('does not call dismissFunction when clickToDismiss is false', () => {
  const dismissToast = jest.fn();

  const { getByTestId } = render(
    <Toast toastData={{ clickToDismiss: false }} dismissToast={dismissToast} />,
  );

  expect(() => getByTestId('global-toast-dismissable-area')).toThrow();
});

test('defaults to info type when not passed type prop', () => {
  const { getByTestId } = render(
    <Banner>
      <div>children</div>
    </Banner>,
  );

  expect(getByTestId('banner')).toHaveStyle(
    'background-color: rgb(47, 155, 216);',
  );
});

test('does not render the closeIcon when closeButton is false', () => {
  const { queryByTestId } = render(
    <Toast toastData={{ closeButton: false }} />,
  );
  const btn = queryByTestId('global-toast-close-btn');

  expect(btn).not.toBeInTheDocument();
});

test('defaults to top position when not passed position prop', () => {
  const { getByTestId } = render(<Toast toastData={{ closeButton: false }} />);

  expect(getByTestId('global-toast')).toHaveStyle(`
    top: 64px;
    bottom: unset;
  `);
});

test('banner at bottom when passed position bottom as prop', () => {
  const { getByTestId } = render(
    <Toast toastData={{ closeButton: false, position: 'bottom' }} />,
  );

  expect(getByTestId('global-toast')).toHaveStyle(`
    bottom: 16px;
    top: unset;
  `);
});

test('banner position unset when passed wrong position as prop', () => {
  const { getByTestId } = render(<Toast toastData={{ position: 'middle' }} />);

  expect(getByTestId('global-toast')).toHaveStyle(`
    bottom: unset;
    top: unset;
  `);
});

test('close button color matches banner theme', () => {
  const { getByTestId } = render(<Toast toastData={{ closeButton: true }} />);
  const closeButton = getByTestId('global-toast-close-btn');
  expect(closeButton).toHaveStyle('fill: white');
});
