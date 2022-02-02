import { Button } from './button';

export const defaultButton = (): JSX.Element => (
  <Button onClick={() => {}}>Default button</Button>
);

export default {
  title: 'Components/Button',
  component: defaultButton,
};
