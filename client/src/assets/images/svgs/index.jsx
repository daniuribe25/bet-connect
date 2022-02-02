import Action from './action';
import Content from './content';
import Notification from './notification';
import Social from './social';
import Logo from './logo';
import Status from './status';
import Platform from './platform';
import Miscellaneous from './miscellaneous';

const categories = {
  action: Action,
  content: Content,
  logo: Logo,
  notification: Notification,
  social: Social,
  status: Status,
  platform: Platform,
  miscellaneous: Miscellaneous,
};

const SVG = ({ icon, ...rest }) => {
  const attrs = {
    'aria-hidden': 'true',
    focusable: 'false',
    ...rest,
  };

  const [category, image] = icon.split(':');

  if (category && !categories[category])
    throw new Error(
      `Category does not exist in [category:image] of icon: ${icon}`,
    );
  if (image && !categories[category][image])
    throw new Error(
      `Image does not exist in [category:image] of icon: ${icon}`,
    );

  const Icon = categories[category][image];

  return <Icon data-testid="svg" icon={icon} {...attrs} />;
};
SVG.categories = categories;

export default SVG;
