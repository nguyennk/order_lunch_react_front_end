import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Modal } from '@ehrocks/react-velonic';

import {
    isOpenConfirmModalSelector
} from '../../state';

const ConfirmModal = ({
    title,
    buttonGroup,
    message,
    isOpen,
}) =>
    <Modal
        title={title}
        effectName="fadeAndScale"
        buttons={buttonGroup}
        open={isOpen}>
        {message}
    </Modal>

const mapStateToProps = state => ({
    isOpen: isOpenConfirmModalSelector(state),
});

const connectToStore = connect(mapStateToProps);

const enhance = compose(connectToStore);

export default enhance(ConfirmModal);