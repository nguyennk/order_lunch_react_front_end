import React from 'react';
import _ from 'lodash';

const generateListGroupAction = (options, onClickAction, selector) => {
    const listGroup = [];
    const all = 'All Dishes';
    if (!options.length)
        return generateListGroupRow(onClickAction, 'None', selector);
    _.each(options, option => {
        listGroup.push(generateListGroupRow(onClickAction, option.tag, selector));
    });
    listGroup.unshift(
        generateListGroupRow(onClickAction, all, selector)
    );
    return listGroup;
}

const generateListGroupRow = (onClickAction, value, selector) => <a
    key={value}
    className={'list-group-item ' + (value != 'None' ? 'list-group-item-action ' : '') + (value != 'None' && value == selector ? 'active' : '')}
    onClick={() => onClickAction(value)}
>{value}</a>

const ListTags = ({
    options,
    onClickAction,
    selector,
}) =>
    <div className="list-group eh-list-group">
        {generateListGroupAction(options, onClickAction, selector)}
    </div>



export default ListTags;