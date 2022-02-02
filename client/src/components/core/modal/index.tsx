import React, { Ref } from 'react';
import { createStyles, makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { ModalType } from 'helpers/pl-types';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import { FullscreenModalWrapper, CenterModalWrapper } from './modal-wrapper';

type ModalTypes = {
  children: JSX.Element;
  type: ModalType;
  onBackdropClick: () => void;
  modalTitle?: string;
}

const Transition = React.forwardRef(function Transition(props: JSX.IntrinsicAttributes & SlideProps, ref: Ref<unknown> | undefined) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(() =>
  createStyles({
    dialog: () => ({
      width: '100%',
      maxWidth: '600px',
      position: 'absolute',
      bottom: '-32px',
    }),
    fullscreen: () => ({
      width: '100%',
      maxWidth: '600px',
      margin: 0,
    }),
    center: {
      width: '100%',
      borderRadius: '40px',
      border: '1px solid #3F7193',
    }
  }),
);

const Modal = ({ children, type, onBackdropClick, modalTitle }: ModalTypes ): JSX.Element => {
  const css = useStyles();

  const renderContent = (): JSX.Element => {
    if (type === 'dialog') {
      return children;
    }
    if (type === 'center') {
      return (
        <CenterModalWrapper modalTitle={modalTitle} closeModal={onBackdropClick}>
          {children}
        </CenterModalWrapper>
      )
    }
    return (
      <FullscreenModalWrapper modalTitle={modalTitle} closeModal={onBackdropClick}>
        {children}
      </FullscreenModalWrapper>
    )
  }
  return (
    <Dialog
      TransitionComponent={Transition}
      open
      PaperProps={{ classes: { root: css[type] }}}
      onBackdropClick={onBackdropClick}
    >
      {renderContent()}
    </Dialog>

  )
}

export default Modal;
