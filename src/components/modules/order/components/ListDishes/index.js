import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FlatButton, Icon, SelectField } from '@ehrocks/react-velonic';
import { formatPrice } from '../../../shared/number_helper';
import {
    variationOptionsSelector,
    setVariationOptions,
    currentOrderSelector,
    setCurrentOrder,
} from '../../state';

const generateListGroupAction = (error, options, others) => {
    const listGroup = [];
    if (error)
        return [error];
    _.each(options, tag => {
        listGroup.push(<li className='list-group-item dish-tag-title' key={tag.tag}>
            {tag.tag}
        </li>);
        _.each(tag.dishes, option => {
            listGroup.push(generateListGroupRow(option, others));
        });
    });
    return listGroup;
}

const generateListGroupRow = (option, others) => {
    return (
        <li className='list-group-item order-dish-item' key={option.id}>
            <div className='row'>
                <div className='dish-image col'>
                    <img src={option.image_source} />
                </div>
                <div className='dish-info col-5'>
                    <span>{option.name}</span>
                    <span>{option.description}</span>
                </div>
                <div className='dish-price col-2'>
                    <span>{formatPrice(others.variationOptions[option.id].value)}</span>
                </div>
                <div className='dish-action col'>
                    <FlatButton
                        className="dish-action-btn"
                        type="default"
                        block
                        onClick={() => {
                            const variation = others.variationOptions[option.id];
                            others.updateCurrentOrder(option, variation, others.currentOrder, 'add');
                        }}
                        custom
                    >
                        <Icon
                            name="ui-1_bold-add"
                            type="mini"
                            color="black"
                            size="x1"
                        />
                    </FlatButton>
                </div>
                <div className={'dish-option ' + (!option.variations.length > 1 ? 'hide' : '')}>
                    <SelectField
                        className="col-4 float-right"
                        name="restaurant"
                        options={option.variations}
                        value={others.variationOptions[option.id]}
                        onChange={val => {
                            const temp = val.label.split('-')[0].trim();
                            const newVal = {
                                label: temp,
                                value: val.value
                            };
                            others.setVariationOption(option.id, newVal, others.variationOptions);
                        }}
                        clearable={false}
                    />
                </div>
            </div>
        </li>
    )
}

const ListDishes = ({
    options,
    error,
    ...others
}) =>
    <div className="list-group eh-list-group">
        {generateListGroupAction(
            error,
            options,
            others)}
    </div>

const mapStateToProps = state => ({
    variationOptions: variationOptionsSelector(state),
    currentOrder: currentOrderSelector(state),
});

const mapDispatchToProps = dispatch => ({
    setVariationOption: (dishId, variation, options) => dispatch(setVariationOptions(dishId, variation, options)),
    updateCurrentOrder: (dish, variation, currentOrder, type) => dispatch(setCurrentOrder(dish, variation, currentOrder, type)),
});

const connectToStore = connect(mapStateToProps, mapDispatchToProps);

const enhance = compose(
    connectToStore
);

export default enhance(ListDishes);