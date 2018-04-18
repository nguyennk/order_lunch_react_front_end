import React from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { FlatButton, Icon } from '@ehrocks/react-velonic';
import { formatPrice } from '../../../shared/number_helper';
import {
    currentOrderSelector,
    setCurrentOrder
} from '../../state';

import {
    setIsOpenConfirmModal,
} from '../../../shared/state';

const generateListGroupAction = (others) => {
    const listGroup = [];
    const no_order = {
        id: 0,
        name: 'No order found'
    };
    if (!others.currentOrder.dishes.length)
        listGroup.push(
            <li key={no_order.id} className='list-group-item order-dish-item'>{no_order.name}</li>
        );

    _.each(others.currentOrder.dishes, option => {
        listGroup.push(generateListGroupRow(others, option));
    });

    listGroup.push(generateSummaryFooter(others.currentOrder));
    return listGroup;
}

const generateSummaryFooter = options =>
    <li key={-1} className='list-group-item order-summary'>
        <div className='float-left'>Total</div>
        <div className={'float-right ' + (options.error ? 'text-error' : '')}>{formatPrice(options.total)}</div>

        <div className="order-summary-error">{options.error ? options.error : ''}</div>
    </li>

const generateListGroupRow = (others, option) =>
    <li key={option.id} className='list-group-item order-dish-item'>
        <div className='row'>
            <span className='float-left col'>
                <strong>{`${option.count} x`}</strong> {option.name}
                <div>{formatPrice(option.variation.value)}</div>
            </span>
            <div className='float-right col-2'>
                <FlatButton
                    className="summary-action-btn"
                    type="default"
                    block
                    onClick={() => {
                        others.updateCurrentOrder(option.dish, option.variation, others.currentOrder, 'delete');
                    }}
                    custom>
                    <Icon
                        name="ui-1_bold-delete"
                        type="mini"
                        color="black"
                        size="x1"
                    />
                </FlatButton>
            </div>
        </div>
    </li>

const ListCurrentOrders = ({
    openConfirmModal,
    ...others
}) =>
    <div className="list-group eh-list-group">
        {generateListGroupAction(others)}
        <FlatButton
            className=""
            type="default"
            onClick={() => {
                openConfirmModal(true);
            }}
            label="Submit"
        />
    </div>


const mapStateToProps = state => ({
    currentOrder: currentOrderSelector(state),
});

const mapDispatchToProps = dispatch => ({
    updateCurrentOrder: (dish, variation, currentOrder, type) => dispatch(setCurrentOrder(dish, variation, currentOrder, type)),
    openConfirmModal: status => dispatch(setIsOpenConfirmModal(status)),
});

const connectToStore = connect(mapStateToProps, mapDispatchToProps);

const enhance = compose(
    connectToStore
);

export default enhance(ListCurrentOrders);