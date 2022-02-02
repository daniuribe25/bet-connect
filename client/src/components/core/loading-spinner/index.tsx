import styled from 'styled-components';
import spinner from 'assets/images/loading-spinner.png';

export const Spinner = styled.img<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  animation: search-spin infinite 2s linear;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes search-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const CenterSpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const LoadingSpinner = ({
  size = 80,
}): JSX.Element => {
  return (
    <Spinner
      data-testid="loading-spinner"
      src={spinner}
      size={size}
      alt="searching"
    />
  );
};

export const CenterSpinner = ({
  size = 80,
}): JSX.Element => (
  <CenterSpinnerWrapper>
    <LoadingSpinner size={size} />
  </CenterSpinnerWrapper>
);

export default LoadingSpinner;
