import { createStyles, makeStyles } from '@material-ui/core';
import { FunctionComponent } from 'react';
import PsnIcon from 'assets/images/psn_icon.svg';
import XboxIcon from 'assets/images/xbox_icon.svg';
import BATTLENETIcon from 'assets/images/pc_icon_blue.svg';
import avatar from 'assets/images/noAvatar.png';
import { UserPlayerTag } from 'helpers/pl-types';

type PlayerTypeProps = {
  user: UserPlayerTag;
};

const gamertagIcons: any = { PSN: PsnIcon, XBL: XboxIcon, BATTLENET: BATTLENETIcon };

const useStyles = makeStyles(() =>
  createStyles({
    playerTag: {
      backgroundColor: '#D4E2EC',
      borderRadius: '83px',
      display: 'flex',
      padding: 8,
      minWidth: 311,
      margin: '2rem 0',
    },
    userPhoto: {
      width: 48,
      height: 48,
      borderRadius: '50%',
    },
    playerName: {
      color: '#0C273A',
      fontSize: '16px',
      lineHeight: '48px',
      marginLeft: 8,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    icon: {
      width: 24,
      marginRight: 8,
      position: 'relative',
      top: 6,
    },
  }),
);

// eslint-disable-next-line import/prefer-default-export
export const PlayerTag: FunctionComponent<PlayerTypeProps> = ({
  user,
}: PlayerTypeProps) => {
  const css = useStyles();
  const anyUser: any = user;
  return (
    <div className={css.playerTag}>
      <img
        className={css.userPhoto}
        src={user.user.urlPhoto || avatar}
        alt="Profile"
      />
      <span className={css.playerName}>
        <img src={gamertagIcons[anyUser.platform].icon} className={css.icon} alt={user.platform} />
        {anyUser.user[`${anyUser.platform.toLowerCase()}PlatformUsername`]}
      </span>
    </div>
  );
};
