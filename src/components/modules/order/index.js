import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Panel, SelectField } from '@ehrocks/react-velonic';
import React from 'react';
import ConfirmModal from '../shared/components/ConfirmModal';
import ListCurrentOrders from './components/ListCurrentOrders';
import ListDishes from './components/ListDishes';
import ListTags from './components/ListTags';
import {
  isOpenConfirmOrderModalSelector,
  setIsOpenConfirmOrderModal,
} from '../shared/state';
import {
  filteredDishesSelector,
  getUniqueTags,
  selectDishTagSelector,
  selectRestaurantSelector,
  setFilteredDishes,
  setSelectDishTag,
  setSelectRestaurant,
  currentOrderSelector,
} from './state';
import { getTodayOrderAC } from './apiCalls/getOrders';
import {
  getOneRestaurantAC,
  getTodayRestaurantsAC,
  restaurantDishesSelector,
  todayRestaurantsSelector,
} from './apiCalls/getRestaurants';
import {
  submitOrderAC,
  submitOrderErrorSelector,
  submitOrderSelector,
} from './apiCalls/post';
import { loginTokenSelector } from '../login/state';

const panelStyle = {
  padding: '10px',
};

const modalButtonGroup = (loginToken, others) => [
  {
    label: 'Submit',
    onClick: () => {
      others.submitOrder(loginToken, others.currentOrder);
      others.openConfirmOrderModal(false);
    },
  },
  {
    label: 'Back',
    onClick: () => others.openConfirmOrderModal(false),
  },
];

const modalMessage = <p>You sure you want to submit this order?</p>;

const restaurantDishesError = (dishTag, restaurant, filteredDishes) => {
  if (
    (restaurant.name || !filteredDishes.length) ===
    'Select a restaurant and tag'
  ) {
    return 'Select a restaurant to get started';
  } else if (!filteredDishes.length || dishTag === 'None') {
    return 'Select a tag first';
  }
  return undefined;
};

const OrderPage = ({
  dishTag,
  filterDishes,
  filteredDishes,
  getOneRestaurant,
  getTodayRestaurants,
  isConfirmOrderModalOpen,
  loginToken,
  restaurant,
  restaurantDishes,
  selectDishTag,
  selectRestaurant,
  setCurrentOrderFromOrder,
  todayRestaurants,
  ...others
}) =>
  loginToken && (
    <div>
      <ConfirmModal
        isOpen={isConfirmOrderModalOpen}
        title="Submit Order"
        buttonGroup={modalButtonGroup(loginToken, others)}
        message={modalMessage}
        onRequestClose={() => others.openConfirmOrderModal(false)}
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
              filterDishes('All Dishes', []);
              getOneRestaurant(loginToken, val.id);
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
                  filterDishes(tag, restaurantDishes);
                }}
                options={getUniqueTags(restaurantDishes)}
                selector={dishTag}
              />
            </Panel>
          </div>
          <div className="col-6">
            <Panel title="Dishes" style={panelStyle}>
              <ListDishes
                error={restaurantDishesError(
                  dishTag,
                  restaurant,
                  filteredDishes
                )}
                options={filteredDishes}
              />
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

const mapStateToProps = state => ({
  currentOrder: currentOrderSelector(state),
  dishTag: selectDishTagSelector(state),
  filteredDishes: filteredDishesSelector(state),
  isConfirmOrderModalOpen: isOpenConfirmOrderModalSelector(state),
  loginToken: loginTokenSelector(state),
  restaurant: selectRestaurantSelector(state),
  restaurantDishes: restaurantDishesSelector(state),
  submitOrderError: submitOrderErrorSelector(state),
  submittedOrder: submitOrderSelector(state),
  todayRestaurants: todayRestaurantsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  filterDishes: (tag, dishes) => dispatch(setFilteredDishes(tag, dishes)),
  getOneRestaurant: (token, restaurantId) =>
    dispatch(getOneRestaurantAC(token, restaurantId)),
  getTodayRestaurants: token => dispatch(getTodayRestaurantsAC(token)),
  getTodayOrder: token => dispatch(getTodayOrderAC(token)),
  openConfirmOrderModal: status => dispatch(setIsOpenConfirmOrderModal(status)),
  selectDishTag: tag => dispatch(setSelectDishTag(tag)),
  selectRestaurant: restaurant => dispatch(setSelectRestaurant(restaurant)),
  submitOrder: (token, currentOrder) =>
    dispatch(submitOrderAC(token, currentOrder)),
});

const connectToStore = connect(mapStateToProps, mapDispatchToProps);

const lifeCycleHOC = lifecycle({
  componentDidMount() {
    this.props.getTodayOrder(this.props.loginToken);
  },
});

const enhance = compose(connectToStore, lifeCycleHOC);

export default enhance(OrderPage);
