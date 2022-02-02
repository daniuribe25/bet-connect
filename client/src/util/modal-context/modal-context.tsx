import {
  useState,
  createContext,
  ReactNode,
} from 'react';
import { ModalType } from 'helpers/pl-types';
import Modal from 'components/core/modal';

export const ModalContext = createContext<UseModalContextType | null>(null);

type UseModalContextType = {
  displayModal: (modalData: ModalTypes) => void;
  dismissModal: () => void;
  displaySecondaryModal: (modalData: SecondaryModalTypes) => void;
  dismissSecondaryModal: () => void;
}

type ModalTypes = {
  modalDisplayed: boolean;
  type: ModalType;
  body: ReactNode;
  modalTitle?: string;
}

type SecondaryModalTypes = {
  modalDisplayed: boolean;
  type: ModalType;
  body: ReactNode;
  modalTitle?: string;
  onClose?: () => void;
}

export const ModalProvider = ({ children }: { children: JSX.Element }): JSX.Element => {
  const [modal, setModal] = useState<ModalTypes>({
    modalDisplayed: false,
    type: 'fullscreen',
    body: null,
    modalTitle: undefined,
  });

  const [secondaryModal, setSecondaryModal] = useState<SecondaryModalTypes>({
    modalDisplayed: false,
    type: 'dialog',
    body: null,
    onClose: () => {},
  });


  const dismissModal = (): void => {
    setModal({
      modalDisplayed: false,
      type: 'fullscreen',
      body: null,
      modalTitle: undefined,
    });
  };

  const displayModal = (modalData: ModalTypes): void => {
    if (modal.modalDisplayed) {
      dismissModal();
    }

    setModal({
      modalDisplayed: modalData.modalDisplayed,
      type: modalData.type,
      body: modalData.body,
      modalTitle: modalData.modalTitle,
    });
  };

  const dismissSecondaryModal = (): void => {
    setSecondaryModal({
      modalDisplayed: false,
      type: 'dialog',
      body: null,
      onClose: () => {},
    });
  };

  const displaySecondaryModal = (modalData: SecondaryModalTypes): void => {
    if (secondaryModal.modalDisplayed) {
      dismissModal();
    }

    setSecondaryModal({
      modalDisplayed: modalData.modalDisplayed,
      body: modalData.body,
      modalTitle: modalData.modalTitle,
      onClose: modalData.onClose,
      type: modalData.type,
    });
  };

  return (
    <ModalContext.Provider value={{ displayModal, dismissModal, displaySecondaryModal, dismissSecondaryModal }}>
      {modal.modalDisplayed && (
        <Modal type={modal?.type} modalTitle={modal?.modalTitle} onBackdropClick={dismissModal}>
          <>
            {modal?.body}
          </>
        </Modal>
      )}
      {secondaryModal.modalDisplayed && (
        <Modal
          type={secondaryModal?.type}
          modalTitle={secondaryModal?.modalTitle}
          onBackdropClick={() => {
           if (secondaryModal?.onClose) secondaryModal?.onClose();
           dismissSecondaryModal();
         }}
        >
          <>
            {secondaryModal?.body}
          </>
        </Modal>
      )}
      {children}
    </ModalContext.Provider>
  );
};
