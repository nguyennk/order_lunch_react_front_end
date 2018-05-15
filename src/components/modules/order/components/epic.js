import flow from 'lodash/fp/flow';
import eq from 'lodash/fp/eq';
import get from 'lodash/fp/get';
import { ACTIONS } from 'redux-api-call';
// import { notifSend } from 'redux-notifications/lib/actions';

import {
  GET_RESTAURANTS,
  GET_ONE_RESTAURANT,
  getOneRestaurantAC,
} from '../apiCalls/getRestaurants';

import { GET_ORDER } from '../apiCalls/getOrders';

// import { SUBMIT_ORDER } from '../apiCalls/post';
import {
  generateInitialCurrentOrder,
  setSelectRestaurant,
  setSelectDishTag,
  setFilteredDishes,
} from '../state';
import { loginTokenSelector } from '../../login/state';

const isGetOrder = flow(get('payload.name'), eq(GET_ORDER));
const setInitialOrderOnload = ({ payload }) => dispatch => {
  dispatch(generateInitialCurrentOrder(payload.json.orderDishes));
};
export const setInitialOrderEpic = action$ =>
  action$
    .ofType(ACTIONS.COMPLETE)
    .filter(isGetOrder)
    .map(setInitialOrderOnload);

const isGetRestaurant = flow(get('payload.name'), eq(GET_RESTAURANTS));
const setInitialRestaurantOnload = ({ payload }) => (dispatch, getState) => {
  dispatch(setSelectRestaurant(payload.json[0]));
  dispatch(getOneRestaurantAC(loginTokenSelector(getState()), payload.json[0].id));
};
export const setInitialRestaurantEpic = action$ =>
  action$
    .ofType(ACTIONS.COMPLETE)
    .filter(isGetRestaurant)
    .map(setInitialRestaurantOnload);

const isGetOneRestaurant = flow(get('payload.name'), eq(GET_ONE_RESTAURANT));
const setInitialTagOnLoad = ({ payload }) => dispatch => {
  dispatch(setSelectDishTag('All Dishes'));
  dispatch(setFilteredDishes('All Dishes', payload.json.dishes));
};
export const setInitialTagEpic = action$ =>
  action$
    .ofType(ACTIONS.COMPLETE)
    .filter(isGetOneRestaurant)
    .map(setInitialTagOnLoad);

// const isSubmitOrder = flow(get('payload.name'), eq(SUBMIT_ORDER));
// const setSubmitOrderOnLoad = () => dispatch => {
//   dispatch(notifSend({
//     message: 'Order Submited',
//     kind: 'success',
//     dismissAfter: 2000,
//   }));
// };
// export const setSubmitOrderEpic = action$ =>
//   action$
//     .ofType(ACTIONS.COMPLETE)
//     .filter(isSubmitOrder)
//     .map(setSubmitOrderOnLoad);
