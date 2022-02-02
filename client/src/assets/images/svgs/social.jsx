const search = ({ ...props }) => (
  <svg width="1.5em" height="1.5em" viewBox="-3 -3 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.71 11H12.5L17.49 16L16 17.49L11 12.5V11.71L10.73 11.43C9.59 12.41 8.11 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 8.11 12.41 9.59 11.43 10.73L11.71 11ZM2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2C4.01 2 2 4.01 2 6.5Z"
    />
  </svg>
);

const userOutline = ({ ...props }) => (
  <svg width="1.5em" height="1.5em" viewBox="-4 -4 24 24" {...props}>
    <path
      height="100%"
      width="100%"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0ZM10.1 4C10.1 2.84 9.16 1.9 8 1.9C6.84 1.9 5.9 2.84 5.9 4C5.9 5.16 6.84 6.1 8 6.1C9.16 6.1 10.1 5.16 10.1 4ZM14.1 13C14.1 12.36 10.97 10.9 8 10.9C5.03 10.9 1.9 12.36 1.9 13V14.1H14.1V13ZM0 13C0 10.34 5.33 9 8 9C10.67 9 16 10.34 16 13V16H0V13Z"
    />
  </svg>
);

export default { search, userOutline };
