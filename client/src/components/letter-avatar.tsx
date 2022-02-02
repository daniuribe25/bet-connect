import { FunctionComponent } from 'react';
import { useLetterAvatarStyles } from 'styles/index';

type LetterAvatarType = {
  name: string;
  style?: any;
};
// eslint-disable-next-line import/prefer-default-export
export const LetterAvatar: FunctionComponent<LetterAvatarType> = ({
  name = '',
  style,
}: LetterAvatarType) => {
  const words = name?.split(' ') || []; // Split the name by spacing
  const letters = words.map((l) => l.charAt(0)).join('');

  const css = useLetterAvatarStyles({
    cant: letters.length,
    width: style?.width,
  });

  return (
    <div className={css.container} style={style}>
      <span className={css.letters}>{letters.substr(0, 2)}</span>
    </div>
  );
};
