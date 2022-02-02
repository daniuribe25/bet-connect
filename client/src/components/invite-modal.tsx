import { FunctionComponent } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  createStyles,
  IconButton,
  makeStyles,
  Button,
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { getUserPlatform } from 'helpers/common';
import cn from 'classnames';
import { UserPlayerTag } from 'helpers/pl-types';
import { PlayerTag } from './player-tag';

type InviteModalProps = {
  user: UserPlayerTag;
  onClick: (accepts: boolean) => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    _dialogRoot: {
      height: 'fit-content',
      width: 'fit-content',
      maxWidth: '600px',
      borderRadius: '40px',
      backgroundColor: '#fff',
      padding: '24px 1rem 1rem 1rem',
    },
    contentRoot: {
      padding: 0,
    },
    actionButton: {
      height: '48px',
      width: '147px',
      fontSize: '25px',
      lineHeight: '48px',
      color: '#fff',
      textAlign: 'center',
      borderRadius: '24px',
      textTransform: 'initial',
    },
    decline: {
      backgroundColor: '#D82F4B !important',
    },
    accept: {
      backgroundColor: '#23CA78 !important',
    },
    title: {
      color: '#0c273a',
      padding: 0,
      display: 'flex',
      width: '100%',
      '& h2': {
        width: '100%',
        display: 'flex',
      },
    },
    titleContent: {
      flex: 1,
      fontSize: '25px',
      lineHeight: '30px',
      fontWeight: 'bold',
    },
    closeButton: {
      color: '#3F7193',
      padding: 0,
      flex: 'initial',
      position: 'relative',
      top: 0,
      right: 0,
      maxHeight: 28,
    },
    content: {
      fontSize: '12.8px',
      lineHeight: '15px',
      color: '#0c273a',
    },
  }),
);

// eslint-disable-next-line import/prefer-default-export
export const InviteModal: FunctionComponent<InviteModalProps> = ({
  user,
  onClick,
}: InviteModalProps) => {
  const css = useStyles({});
  const handleClose = (): void => {
    onClick(false);
  };
  const name = getUserPlatform(user?.user).username;
  if (!user) return null;
  return (
    <Dialog
      open
      onClose={handleClose}
      // eslint-disable-next-line no-underscore-dangle
      PaperProps={{ classes: { root: css._dialogRoot } }}
      onBackdropClick={handleClose}
    >
      <DialogTitle classes={{ root: css.title }}>
        <div className={css.titleContent}>Team Invite</div>
        <IconButton
          className={css.closeButton}
          component="span"
          onClick={handleClose}
        >
          <HighlightOffIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={css.contentRoot}>
        <p className={css.content}>{name} has invited you to their team.</p>
        <PlayerTag user={user} />
      </DialogContent>
      <DialogActions>
        <Button
          className={cn(css.actionButton, css.decline)}
          onClick={handleClose}
        >
          Decline
        </Button>
        <Button
          className={cn(css.actionButton, css.accept)}
          onClick={() => onClick(true)}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};
