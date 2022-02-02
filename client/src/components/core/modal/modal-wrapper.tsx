import ModalHeader from 'components/core/modal-header';
import {
  Wrapper,
  BodyWrapper,
  HeaderWrapper,
  CenterWrapper,
  CenterModalHeader,
  CloseButton,
  CenterHeaderWrapper,
} from './index.styles';

type ModalProps = {
  closeModal: () => void;
  children: JSX.Element;
  modalTitle?: string;
}

export const FullscreenModalWrapper = ({ closeModal, children, modalTitle }: ModalProps): JSX.Element => (
  <Wrapper>
    <HeaderWrapper>
      <ModalHeader closeOnClick={closeModal} title={modalTitle || ''} />
    </HeaderWrapper>

    <BodyWrapper>
      {children}
    </BodyWrapper>
  </Wrapper>
);

export const CenterModalWrapper = ({ closeModal, children, modalTitle }: ModalProps): JSX.Element => (
  <CenterWrapper>
    <CenterHeaderWrapper>
      <CenterModalHeader>{modalTitle}</CenterModalHeader>
      <CloseButton onClick={closeModal} icon="action:crossCircle" />
    </CenterHeaderWrapper>

    {children}
  </CenterWrapper>
);
