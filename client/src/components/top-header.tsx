import { Button } from '@material-ui/core';
import { FunctionComponent } from 'react';
import Logo from 'assets/images/logo.svg';
import BetaTag from 'components/beta-tag';
import { useTopHeaderStyles } from 'styles/index';

type TopHeaderProps = {
  buttonText: string;
  onButtonClick: () => void;
  style?: any;
};

export const TopHeader: FunctionComponent<TopHeaderProps> = ({
  buttonText,
  onButtonClick,
  style,
}: TopHeaderProps) => {
  const css = useTopHeaderStyles();
  return (
    <div className={css.root} style={style || {}}>
      <div className={css.logoContainer}>
        <img src={Logo} className={css.logo} alt="Player Lounge" />
        <span className={css.logoText}>Connect</span>
        <BetaTag />
      </div>
      <div className={css.buttonContainer}>
        <Button onClick={onButtonClick} className={css.actionButton}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default TopHeader;
