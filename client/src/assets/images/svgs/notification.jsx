const warning = ({ ...props }) => (
  <svg width="1.5em" height="1.5em" viewBox="0 -1 24 24" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 19L11 0L22 19H0ZM18.53 17L11 3.99L3.47 17H18.53ZM10 14V16H12V14H10ZM10 8H12V12H10V8Z"
    />
  </svg>
);

export default { warning };
