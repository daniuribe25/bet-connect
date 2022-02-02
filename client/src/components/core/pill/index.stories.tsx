import Pill from '.';

export const infoPill = (): JSX.Element => (
  <Pill variant="info">Info pill</Pill>
);
export const warningPill = (): JSX.Element => (
  <Pill variant="warning">Warning pill</Pill>
);
export const successPill = (): JSX.Element => (
  <Pill variant="success">Success pill</Pill>
);

export default {
  title: 'Components/Core/Pill',
  component: infoPill,
};
