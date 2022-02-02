import ModalHeader from '.';

export const modalHeaderWithButtons = (): JSX.Element => (
  <ModalHeader title="Modal header" backOnClick={() => {}} closeOnClick={() => {}} />
);

export const modalHeaderWithBack = (): JSX.Element => (
  <ModalHeader title="Modal header" backOnClick={() => {}} />
);

export const modalHeaderWithClose = (): JSX.Element => (
  <ModalHeader title="Modal header" closeOnClick={() => {}} />
);

export const modalHeaderNoButtons = (): JSX.Element => (
  <ModalHeader title="Modal header" />
);

export default {
  title: 'Components/Core/Modal Header',
  component: modalHeaderWithButtons,
};
