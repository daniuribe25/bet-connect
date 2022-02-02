import { FunctionComponent } from 'react';
import {
  createStyles,
  makeStyles,
  Button,
  capitalize,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import noAvatar from 'assets/images/noAvatar.png';
import PsnIcon from 'assets/images/psn_icon.svg';
import XboxIcon from 'assets/images/xbox_icon.svg';
import PcIcon from 'assets/images/pc_icon_blue.svg';
import PsnIconWhite from 'assets/images/psn_icon_white.svg';
import XboxIconWhite from 'assets/images/xbox_icon_white.svg';
import battlenetIconWhite from 'assets/images/pc_icon_white.svg';
import { UserPlayerTag } from 'helpers/pl-types';
import { teamUsersColors } from '../team-tab';

type PlayerItemProps = {
  platform: string;
  name: string;
  added: boolean;
  photo?: string;
  user: UserPlayerTag;
  onClick: (added: boolean, user: UserPlayerTag) => void;
  isUpdate: boolean;
  index?: number;
};

const gamerTagValues: {[key: string]: { icon: any, whiteIcon: any }} = {
  PSN: { icon: PsnIcon, whiteIcon: PsnIconWhite },
  XBL: { icon: XboxIcon, whiteIcon: XboxIconWhite },
  BATTLENET: { icon: PcIcon, whiteIcon: battlenetIconWhite },
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: ({ isUpdate }: any) => ({
      color: !isUpdate ? theme.palette.primary.main : '#fff',
      backgroundColor: !isUpdate ? 'inherit' : '#031725',
      display: 'flex',
      padding: !isUpdate ? '1rem' : '0.7rem 1rem',
    }),
    photo: {
      width: 48,
      height: 48,
      borderRadius: '50%',
    },
    playerName: ({ isUpdate }: any) => ({
      color: !isUpdate ? theme.palette.primary.main : '#fff',
      fontSize: 16,
      height: 28,
      margin: !isUpdate ? 'auto 0 auto 1rem' : 'auto 0 auto 0.7rem',
    }),
    icon: {
      width: 20,
      marginRight: '0.5rem',
      position: 'relative',
      top: 5,
    },
    leftItems: {
      flex: 1,
      display: 'flex',
    },
    separator: {
      border: '1px solid #D4E2EC',
      width: '100%',
      paddingLeft: '1rem',
    },
    addPlayer: {
      width: 36,
      height: 34,
      color: '#2F9BD8',
      margin: 'auto',
      minWidth: '0',
    },
    cancelPlayer: ({ isUpdate }: any) => ({
      color: !isUpdate ? '#D82F4B' : '#3F7193',
      textTransform: 'none',
    }),
    circle: ({ index }: any) => ({
      border: '1px solid #ffffff',
      backgroundColor: teamUsersColors[index],
      width: '43px',
      height: '43px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& span': {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '500',
      },
    }),
  }),
);

export const PlayerItem: FunctionComponent<PlayerItemProps> = ({
  platform,
  photo = noAvatar,
  name,
  added,
  user,
  onClick,
  isUpdate,
  index,
}: PlayerItemProps) => {
  const css = useStyles({ isUpdate, index });
  const handleClick = (): void => {
    onClick(added, user);
  };

  return (
    <>
      <div
        className={css.container}
        onClick={handleClick}
        onKeyPress={handleClick}
        tabIndex={0}
        role="button"
      >
        <div className={css.leftItems}>
          {!isUpdate ? (
            <img src={photo} className={css.photo} alt="psnIcon" />
          ) : (
            <div className={css.circle}>
              <span>{capitalize(name[0])}</span>
            </div>
          )}
          <span className={css.playerName}>
            <img
              src={!isUpdate ? gamerTagValues[platform].icon : gamerTagValues[platform].whiteIcon}
              className={css.icon}
              alt={`${platform.toLowerCase()}Icon`}
            />
            {name}
          </span>
        </div>
        {!added && (
          <Button className={css.addPlayer}>
            <AddCircleOutlineIcon />
          </Button>
        )}
        {added && (
          <Button className={css.cancelPlayer}>
            {!isUpdate ? 'Cancel' : index !== 0 && <CloseIcon />}
          </Button>
        )}
      </div>
      {!isUpdate && <div className={css.separator} />}
    </>
  );
};

export const AddplayerItem: FunctionComponent<any> = ({ onClick }: any) => {
  const css = useStyles({ isUpdate: true });
  return (
    <>
      <div
        className={css.container}
        onClick={onClick}
        onKeyPress={onClick}
        tabIndex={0}
        role="button"
      >
        <div className={css.leftItems}>
          <div className={css.circle}>
            <SearchIcon />
          </div>
          <span className={css.playerName}>Add teammate</span>
        </div>
      </div>
    </>
  );
};
