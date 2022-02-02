import { DefaultAvatar, LetterAvatar } from '.';

export const defaultAvatar = (): JSX.Element => (
  <DefaultAvatar  />
);

export const letterAvatar = (): JSX.Element => (
  <LetterAvatar username="wooldynasty" />
);


export default {
  title: 'Components/Core/Teams Entered/Default Avatar',
  component: defaultAvatar,
};
