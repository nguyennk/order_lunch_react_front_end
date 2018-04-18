import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Panel, SelectField } from '@ehrocks/react-velonic';
import ListTags from './components/ListTags';
import ListDishes from './components/ListDishes';
import ListCurrentOrders from './components/ListCurrentOrders';
import ConfirmModal from '../shared/components/ConfirmModal';
import {
    setSelectDishTag,
    selectDishTagSelector,
    setSelectRestaurant,
    selectRestaurantSelector,
    setFilteredDishes,
    filteredDishesSelector,
    getUniqueTags,
} from './state';
import {
    getTodayRestaurantsAC,
    todayRestaurantsSelector,
    getOneRestaurantAC,
    restaurantDishesSelector,
} from './apiCalls/get';
import {
    loginTokenSelector,
} from '../login/state';
import {
    setIsOpenConfirmModal,
} from '../shared/state';


const panelStyle = {
    padding: '10px'
}

const modalButtonGroup = openConfirmModal => [
    {
        label: 'Submit', onClick: () => { }
    },
    {
        label: 'Back', onClick: () => openConfirmModal(false)
    }
]

const modalMessage = (
    <p>
        You sure you want to submit this order?
    </p>
)

const OrderPage = ({
    loginToken,
    openConfirmModal,
    selectDishTag,
    dishTag,
    todayRestaurants,
    getTodayRestaurants,
    restaurant,
    selectRestaurant,
    getOneRestaurant,
    restaurantDishes,
    filterDishes,
    filteredDishes,
}) => loginToken && (
    <div>
        <ConfirmModal
            title='Submit Order'
            buttonGroup={modalButtonGroup(openConfirmModal)}
            message={modalMessage}
        />
        <div id="order-top-panel">
            <div className="row">
                <SelectField
                    className="col-3"
                    id="order-restaurant-select"
                    label="Restaurants"
                    name="restaurant"
                    options={todayRestaurants}
                    fetchData={() => getTodayRestaurants(loginToken)}
                    labelKey="name"
                    valueKey="id"
                    value={restaurant}
                    onChange={val => {
                        selectRestaurant(val);
                        getOneRestaurant(loginToken, val.id);
                        selectDishTag(dishTag);
                        setTimeout(filterDishes(dishTag, restaurantDishes), 2000);
                    }}
                    clearable={false}
                />
            </div>
        </div>
        <div id="order-main-panel">
            <div className="row">
                <div className="col-3">
                    <Panel title="Tags" style={panelStyle}>
                        <ListTags
                            onClickAction={tag => {
                                selectDishTag(tag);
                                filterDishes(tag, restaurantDishes)
                            }}
                            options={getUniqueTags(restaurantDishes)}
                            selector={dishTag} />
                    </Panel>
                </div>
                <div className="col-6">
                    <Panel title="Dishes" style={panelStyle}>
                        <ListDishes
                            error={restaurantDishesError(dishTag, restaurant)}
                            options={filteredDishes} />
                    </Panel>
                </div>
                <div className="col">
                    <Panel title="Summary" style={panelStyle}>
                        <ListCurrentOrders />
                    </Panel>
                </div>
            </div>
        </div>
    </div>
);

const restaurantDishesError = (dishTag, restaurant) => {
    if (restaurant.name == 'Select a restaurant')
        return 'Select a restaurant to get started';
    else if (dishTag == 'None')
        return 'Select a tag first';
    else
        return undefined;
}

const mapStateToProps = state => ({
    dishTag: selectDishTagSelector(state),
    restaurant: selectRestaurantSelector(state),
    restaurantDishes: restaurantDishesSelector(state),
    todayRestaurants: todayRestaurantsSelector(state),
    filteredDishes: filteredDishesSelector(state),
    loginToken: loginTokenSelector(state),
});

const mapDispatchToProps = dispatch => ({
    selectDishTag: tag => dispatch(setSelectDishTag(tag)),
    selectRestaurant: restaurant => dispatch(setSelectRestaurant(restaurant)),
    getTodayRestaurants: token => dispatch(getTodayRestaurantsAC(token)),
    getOneRestaurant: (token, restaurantId) => dispatch(getOneRestaurantAC(token, restaurantId)),
    filterDishes: (tag, dishes) => dispatch(setFilteredDishes(tag, dishes)),
    openConfirmModal: status => dispatch(setIsOpenConfirmModal(status)),
});

const connectToStore = connect(mapStateToProps, mapDispatchToProps);

const enhance = compose(
    connectToStore
);

export default enhance(OrderPage);