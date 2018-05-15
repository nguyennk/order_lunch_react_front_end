import React from 'react';
import { Modal } from '@ehrocks/react-velonic';

const ConfirmModal = ({
  title,
  buttonGroup,
  message,
  isOpen,
  onRequestClose,
}) => (
  <Modal
    title={title}
    effectName="fadeAndScale"
    buttons={buttonGroup}
    open={isOpen}
    onRequestClose={onRequestClose}
  >
    {message}
  </Modal>
);

export default ConfirmModal;
