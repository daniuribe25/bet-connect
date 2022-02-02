/* eslint-disable react/jsx-pascal-case */
import Logo from './logo';

export const defaultLogo = () => <Logo.playersLounge />;

export const darkLogo = () => <Logo.playersLounge type="dark" />;

export default {
  title: 'Design System/SVGs',
  components: defaultLogo,
};
