import { useContext } from 'react';
import { render, fireEvent, act } from 'unit-test-utils';
import { ToastProvider, ToastContext } from './toast-context';

jest.useFakeTimers();

const longSubtext =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

const TestComponent = ({ toastData }) => {
  const toastContext = useContext(ToastContext)

  return (
    <button
      type="button"
      onClick={() => {
        toastContext?.displayToast(toastData);
      }}
    >
      click
    </button>
  );
};

test('displays toast when toastDisplayed is true and disappears after 5 seconds', async () => {
  const { getByText } = render(
    <ToastProvider>
      <TestComponent
        toastData={{ toastDisplayed: true, heading: 'toast heading' }}
      />
    </ToastProvider>,
  );

  expect(() => getByText('toast heading')).toThrow();

  fireEvent.click(getByText('click'));

  expect(getByText('toast heading')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(() => getByText('toast heading')).toThrow();
});

test('displays toast for longer period of time when more than 120 characters appears on toast', async () => {
  const { getByText } = render(
    <ToastProvider>
      <TestComponent
        toastData={{
          toastDisplayed: true,
          heading: 'toast heading',
          subtext: longSubtext,
        }}
      />
    </ToastProvider>,
  );

  expect(() => getByText('toast heading')).toThrow();
  fireEvent.click(getByText('click'));
  expect(getByText('toast heading')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(7000);
  });

  expect(() => getByText('toast heading')).toThrow();
});

test('resets interval when a new toast is being displayed', async () => {
  const { getByText } = render(
    <ToastProvider>
      <TestComponent
        toastData={{
          toastDisplayed: true,
          heading: 'toast heading',
          subtext: longSubtext,
        }}
      />
    </ToastProvider>,
  );

  expect(() => getByText('toast heading')).toThrow();
  fireEvent.click(getByText('click'));
  expect(getByText('toast heading')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(getByText('toast heading')).toBeInTheDocument();

  fireEvent.click(getByText('click'));

  act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(getByText('toast heading')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  expect(() => getByText('toast heading')).toThrow();
});

test('displays toast and only disappears when toast is clicked', async () => {
  const { getByText, getByTestId } = render(
    <ToastProvider>
      <TestComponent
        toastData={{
          toastDisplayed: true,
          heading: 'toast heading',
          clickToDismiss: true,
        }}
      />
    </ToastProvider>,
  );

  expect(() => getByText('toast heading')).toThrow();
  fireEvent.click(getByText('click'));
  expect(getByText('toast heading')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(getByText('toast heading')).toBeInTheDocument();

  fireEvent.click(getByTestId('global-toast-dismissable-area'));

  expect(() => getByText('toast heading')).toThrow();
});

test('displays toast with a close button and only disappears when the button is clicked', async () => {
  const { getByText, getByTestId } = render(
    <ToastProvider>
      <TestComponent
        toastData={{
          toastDisplayed: true,
          heading: 'toast heading',
          closeButton: true,
        }}
      />
    </ToastProvider>,
  );

  expect(() => getByText('toast heading')).toThrow();
  fireEvent.click(getByText('click'));
  expect(getByText('toast heading')).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(5000);
  });

  expect(getByText('toast heading')).toBeInTheDocument();

  fireEvent.click(getByTestId('global-toast-close-btn'));

  expect(() => getByText('toast heading')).toThrow();
});

test('displays buttons when displayOptions is true', () => {
  const firstBtnOnClick = jest.fn();
  const secondBtnOnClick = jest.fn();

  const { getByText, getByTestId } = render(
    <ToastProvider>
      <TestComponent
        toastData={{
          toastDisplayed: true,
          displayOptions: true,
          type: 'warning',
          heading: 'Toast Heading Error',
          subtext: 'hello world',
          firstBtnOnClick,
          firstBtnText: 'Confirm',
          secondBtnOnClick,
          secondBtnText: 'Close',
          clickToDismiss: true,
        }}
      />
    </ToastProvider>,
  );

  fireEvent.click(getByText('click'));
  expect(getByText('Toast Heading Error')).toBeInTheDocument();

  fireEvent.click(getByTestId('global-toast-first-btn'));

  expect(firstBtnOnClick).toHaveBeenCalledTimes(1);

  fireEvent.click(getByTestId('global-toast-second-btn'));

  expect(secondBtnOnClick).toHaveBeenCalledTimes(1);

  fireEvent.click(getByTestId('global-toast-dismissable-area'));

  expect(() => getByText('Toast Heading Error')).toThrow();
});

test('displays close button when closeButton is true', () => {
  const { getByText, queryByTestId } = render(
    <ToastProvider>
      <TestComponent
        toastData={{
          toastDisplayed: true,
          type: 'warning',
          heading: 'Toast Heading Error',
          subtext: 'hello world',
          closeButton: true,
        }}
      />
    </ToastProvider>,
  );

  fireEvent.click(getByText('click'));
  expect(getByText('Toast Heading Error')).toBeInTheDocument();

  const closeBtn = queryByTestId('global-toast-close-btn');

  expect(closeBtn).toBeInTheDocument();

  fireEvent.click(closeBtn);

  expect(() => getByText('Toast Heading Error')).toThrow();
});
