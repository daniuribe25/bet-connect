import {
  FunctionComponent,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from 'react';
import { createStyles, makeStyles, IconButton } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import CloseIcon from '@material-ui/icons/Close';
import { Button } from './button';

interface ModalProps extends StyleProps {
  title: ReactNode;
  open: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  actions?: ModalAction[];
  closeButton?: boolean;
}

interface StyleProps {
  height?: number | string;
  width?: number | string;
  withPadding?: boolean;
  style?: any;
  noPadding?: boolean;
}

interface ModalAction {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type?: HTMLAttributes<HTMLButtonElement> | any;
  disabled?: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    _dialogRoot: (props: StyleProps) => ({
      height: props.height || 'fit-content',
      width: props.width || 'fit-content',
      maxWidth: '600px',
      ...props.style,
    }),
    dialogActionsRoot: (props: StyleProps) => ({
      margin: `0 ${theme.spacing(2)}px`,
      padding: `0 ${props.withPadding && theme.spacing(2)}px`,
    }),
    actionButton: {
      height: '42px',
      width: '100px',
    },
    title: {
      color: '#0C273A',
      padding: '8px 24px 5px 24px',
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
    contentStyles: (props: StyleProps) => ({
      padding: props.noPadding ? '0' : '8px 24px',
      '& p': {
        height: '100%',
      },
    }),
  }),
);

// eslint-disable-next-line import/prefer-default-export
export const Modal: FunctionComponent<ModalProps> = (props: ModalProps) => {
  const {
    title,
    open,
    onClose,
    height,
    width,
    actions,
    withPadding,
    children,
    style = {},
    closeButton,
    noPadding,
  } = props;
  const css = useStyles({ height, width, withPadding, style, noPadding });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      // eslint-disable-next-line no-underscore-dangle
      PaperProps={{ classes: { root: css._dialogRoot } }}
      onBackdropClick={onClose}
    >
      <DialogTitle classes={{ root: css.title }}>
        <div className={css.titleContent}>{title}</div>
        {closeButton && (
          <IconButton
            className={css.closeButton}
            component="span"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent className={css.contentStyles}>{children}</DialogContent>
      {actions && (
        <DialogActions classes={{ root: css.dialogActionsRoot }}>
          {actions.map(
            ({ onClick, title: actionTitle, disabled, type }, idx) => (
              <Button
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                className={css.actionButton}
                {...{ onClick, disabled, type }}
              >
                {actionTitle}
              </Button>
            ),
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};
