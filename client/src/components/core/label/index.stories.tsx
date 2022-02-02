import Label from '.';

export const defaultLabel = (): JSX.Element => (
  <Label variant="lightBlue" size="small">Default</Label>
);

export const successLabel = (): JSX.Element => (
  <Label variant="success" size="small">Joined</Label>
);

export default {
  title: 'Components/Core/Label',
  component: defaultLabel,
};
