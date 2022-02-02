const arrowUp = ({ ...props }) => (
  <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" {...props}>
    <path d="M17 14.5L12 9.5L7 14.5L17 14.5Z" />
  </svg>
);

const inputArrowUp = ({ props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6 12L7.0575 13.0575L11.25 8.8725V18H12.75V8.8725L16.935 13.065L18 12L12 6L6 12Z" />
  </svg>
);

const inputArrowUpLarge = ({ props }) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6 12L7.0575 13.0575L11.25 8.8725V18H12.75V8.8725L16.935 13.065L18 12L12 6L6 12Z" />
  </svg>
);

const arrowRight = ({ ...props }) => (
  <svg height="1.5rem" width="1.5rem" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.5 17L14.5 12L9.5 7V17Z" />
  </svg>
);

const arrowLeft = ({ ...props }) => (
  <svg
    width="1.5rem"
    height="1.5rem"
    viewBox="0 0 24 24"
    transform="rotate(180)"
    {...props}
  >
    <path d="M9.5 17L14.5 12L9.5 7V17Z" />
  </svg>
);

const arrowDown = ({ ...props }) => (
  <svg height="1.5rem" width="1.5rem" viewBox="0 0 24 24" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M7 9.5L12 14.5 17 9.5z" />
  </svg>
);

const longArrowLeft = ({ fill = '#000000' }) => (
  <svg width="12px" height="12px" viewBox="0 0 12 12" transform="rotate(270)">
    <path
      d="M0 6L1.0575 7.0575L5.25 2.8725V12H6.75V2.8725L10.935 7.065L12 6L6 0L0 6Z"
      fill={fill}
    />
  </svg>
);

const longArrowRight = ({ fill = '#000000' }) => (
  <svg width="12px" height="12px" viewBox="0 0 12 12" transform="rotate(90)">
    <path
      d="M0 6L1.0575 7.0575L5.25 2.8725V12H6.75V2.8725L10.935 7.065L12 6L6 0L0 6Z"
      fill={fill}
    />
  </svg>
);

const watching = ({ ...props }) => (
  <svg width="22" height="15" viewBox="0 0 22 15" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0ZM11 4.5C12.656 4.5 14 5.844 14 7.5C14 9.156 12.656 10.5 11 10.5C9.344 10.5 8 9.156 8 7.5C8 5.844 9.344 4.5 11 4.5ZM6 7.5C6 4.74444 8.24444 2.5 11 2.5C13.7556 2.5 16 4.74444 16 7.5C16 10.2556 13.7556 12.5 11 12.5C8.24444 12.5 6 10.2556 6 7.5Z"
    />
  </svg>
);

const hide = ({ ...props }) => (
  <svg width="22" height="19" viewBox="0 0 22 19" {...props}>
    <path d="M11 4.5C13.76 4.5 16 6.74 16 9.5C16 10.15 15.87 10.76 15.64 11.33L18.56 14.25C20.07 12.99 21.26 11.36 21.99 9.5C20.26 5.11 15.99 2 10.99 2C9.59 2 8.25 2.25 7.01 2.7L9.17 4.86C9.74 4.63 10.35 4.5 11 4.5ZM1 1.77L3.28 4.05L3.74 4.51C2.08 5.8 0.78 7.52 0 9.5C1.73 13.89 6 17 11 17C12.55 17 14.03 16.7 15.38 16.16L15.8 16.58L18.73 19.5L20 18.23L2.27 0.5L1 1.77ZM6.53 7.3L8.08 8.85C8.03 9.06 8 9.28 8 9.5C8 11.16 9.34 12.5 11 12.5C11.22 12.5 11.44 12.47 11.65 12.42L13.2 13.97C12.53 14.3 11.79 14.5 11 14.5C8.24 14.5 6 12.26 6 9.5C6 8.71 6.2 7.97 6.53 7.3ZM10.84 6.52L13.99 9.67L14.01 9.51C14.01 7.85 12.67 6.51 11.01 6.51L10.84 6.52Z" />
  </svg>
);

const edit = ({ ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM3 17.25L14.06 6.19L17.81 9.94L6.75 21H3V17.25Z"
    />
  </svg>
);

const sent = ({ ...props }) => (
  <svg width="1.5em" height="1.5em" viewBox="-1 -3 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 7L0.01 0L21 9L0.01 18L0 11L15 9L0 7ZM2.01 3.03L9.52 6.25L2 5.25L2.01 3.03ZM9.51 11.75L2 14.97V12.75L9.51 11.75Z"
    />
  </svg>
);

const circlePlus = ({ ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
    />
  </svg>
);

const close = ({ ...props }) => (
  <svg viewBox="0 0 24 24" height="1.5rem" width="1.5rem" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6L19 6.4z"
    />
  </svg>
);

const chevronLeft = ({ ...props }) => (
  <svg width="24" height="24" viewBox="0 0 12 20" {...props}>
    <path d="M11.67 1.77L9.89 0L0 9.9L9.9 19.8L11.67 18.03L3.54 9.9L11.67 1.77Z" />
  </svg>
);

const chevronLeftCarousel = ({ ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path d="M11.67 1.77L9.89 0L0 9.9L9.9 19.8L11.67 18.03L3.54 9.9L11.67 1.77Z" />
  </svg>
);

const chevronRight = ({ ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M5.99992 3.77L7.77992 2L17.6699 11.9L7.76992 21.8L5.99992 20.03L14.1299 11.9L5.99992 3.77Z" />
  </svg>
);

const groupAdd = ({ ...props }) => (
  <svg viewBox="0 0 24 24" height="1.5rem" width="1.5rem" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 12C13.93 12 15.5 10.43 15.5 8.5C15.5 6.57 13.93 5 12 5C10.07 5 8.5 6.57 8.5 8.5C8.5 10.43 10.07 12 12 12ZM5 15V12H8V10H5V7H3V10H0V12H3V15H5ZM12 13.75C9.66 13.75 5 14.92 5 17.25V19H19V17.25C19 14.92 14.34 13.75 12 13.75ZM12 15.75C10.21 15.75 8.18 16.42 7.34 17H16.66C15.82 16.42 13.79 15.75 12 15.75ZM13.5 8.5C13.5 7.67 12.83 7 12 7C11.17 7 10.5 7.67 10.5 8.5C10.5 9.33 11.17 10 12 10C12.83 10 13.5 9.33 13.5 8.5ZM17 12C18.93 12 20.5 10.43 20.5 8.5C20.5 6.57 18.93 5 17 5C16.76 5 16.52 5.02 16.29 5.07C17.05 6.01 17.5 7.2 17.5 8.5C17.5 9.8 17.03 10.98 16.27 11.92C16.51 11.97 16.75 12 17 12ZM21 17.25C21 15.89 20.32 14.83 19.32 14.02C21.56 14.49 24 15.56 24 17.25V19H21V17.25Z"
    />
  </svg>
);

const cancelMatch = ({ ...props }) => (
  <svg viewBox="0 0 24 24" height="1.5rem" width="1.5rem" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V15H5V19H19V5H5V9H3V5C3 3.9 3.89 3 5 3ZM11.5 17L10.09 15.59L12.67 13H3V11H12.67L10.09 8.41L11.5 7L16.5 12L11.5 17Z"
    />
  </svg>
);

const search = ({ ...props }) => (
  <svg width="24" height="24" viewBox="0 0 18 18" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.71 11H12.5L17.49 16L16 17.49L11 12.5V11.71L10.73 11.43C9.59 12.41 8.11 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 8.11 12.41 9.59 11.43 10.73L11.71 11ZM2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2C4.01 2 2 4.01 2 6.5Z"
    />
  </svg>
);

const menu = ({ ...props }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 8V6H21V8H3ZM3 13H21V11H3V13ZM3 18H21V16H3V18Z"
    />
  </svg>
);

const circleDot = ({ ...props }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.99337 0.333252C3.31337 0.333252 0.333374 3.31992 0.333374 6.99992C0.333374 10.6799 3.31337 13.6666 6.99337 13.6666C10.68 13.6666 13.6667 10.6799 13.6667 6.99992C13.6667 3.31992 10.68 0.333252 6.99337 0.333252ZM7.00004 12.3333C4.05337 12.3333 1.66671 9.94658 1.66671 6.99992C1.66671 4.05325 4.05337 1.66659 7.00004 1.66659C9.94671 1.66659 12.3334 4.05325 12.3334 6.99992C12.3334 9.94658 9.94671 12.3333 7.00004 12.3333ZM3.00004 6.99992C3.00004 4.79192 4.78804 2.99992 6.99604 2.99992C9.20804 2.99992 11 4.79192 11 6.99992C11 9.20792 9.20804 10.9999 6.99604 10.9999C4.78804 10.9999 3.00004 9.20792 3.00004 6.99992Z"
      fill="white"
    />
  </svg>
);

const crossCircle = ({ ...props }) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="svg-action-crossCircle"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM14.59 8L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41L14.59 8ZM4 12C4 16.41 7.59 20 12 20C16.41 20 20 16.41 20 12C20 7.59 16.41 4 12 4C7.59 4 4 7.59 4 12Z"
    />
  </svg>
);

const options = ({ ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12Z"
    />
  </svg>
);

const trash = ({ ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    data-testid="svg-action-trash"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM16 9V19H8V9H16ZM6 7H18V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V7Z"
      fill="#3F7193"
    />
  </svg>
);

const chevronUp = ({ ...props }) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14.4148 11.9567L15.6498 10.77L8.74197 4.1767L1.8341 10.7767L3.06914 11.9567L8.74197 6.5367L14.4148 11.9567Z" fill="#3F7193"/>
  </svg>
)

const chevronDown = ({ ...props }) => (
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2.8388 4.04336L1.60376 5.23003L8.51163 11.8234L15.4195 5.22336L14.1845 4.04336L8.51163 9.46336L2.8388 4.04336Z" fill="#3F7193"/>
  </svg>
)

const radioButton = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="white"/>
  </svg>
)

const radioButtonChecked = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11.5" fill="white" stroke="#2F9BD8"/>
    <circle cx="12" cy="12" r="8" fill="#2F9BD8"/>
  </svg>
)

export default {
  arrowDown,
  arrowLeft,
  arrowRight,
  arrowUp,
  cancelMatch,
  chevronLeft,
  chevronRight,
  chevronUp,
  chevronDown,
  circlePlus,
  close,
  circleDot,
  crossCircle,
  edit,
  groupAdd,
  hide,
  inputArrowUp,
  inputArrowUpLarge,
  longArrowLeft,
  longArrowRight,
  menu,
  options,
  search,
  sent,
  trash,
  watching,
  chevronLeftCarousel,
  radioButton,
  radioButtonChecked,
};
