import { makeFetchAction } from 'redux-api-call';
import * as config from '../../../../constants/serverRoutes';
import { createSelector } from 'reselect';
import { get } from 'lodash/fp';
export const GET_RESTAURANTS = 'GET_RESTAURANTS';
const restaurantsEndPointSelector = () => {
    return `http://${config.api.root}:${config.api.port}/api/restaurants`;
}
import { Authorized } from '../../shared/request_helper';


const {
    actionCreator: getTodayRestaurantsAC,
    dataSelector: todayRestaurantsSelector,
    errorSelector: todayRestaurantsErrorSelector,
    isFetchingSelector: isFetchingTodayRestaurantsSelector,
} = makeFetchAction(
    GET_RESTAURANTS,
    token => ({
        method: 'GET',
        endpoint: restaurantsEndPointSelector(),
        headers: Authorized(token)
    })
);

export {
    getTodayRestaurantsAC,
    todayRestaurantsSelector,
    todayRestaurantsErrorSelector,
    isFetchingTodayRestaurantsSelector,
};

export const GET_ONE_RESTAURANT = 'GET_ONE_RESTAURANT';
const oneRestaurantEndPointSelector = restaurantId => {
    return `${restaurantsEndPointSelector()}/${restaurantId}`;
}

const {
    actionCreator: getOneRestaurantAC,
    dataSelector: oneRestaurantSelector,
    errorSelector: oneRestaurantErrorSelector,
    isFetchingSelector: isFetchingOneRestaurantSelector,
} = makeFetchAction(
    GET_ONE_RESTAURANT,
    (token, restaurantId) => ({
        method: 'GET',
        endpoint: oneRestaurantEndPointSelector(restaurantId),
        headers: Authorized(token)
    })
);

export const restaurantDishesSelector = createSelector(oneRestaurantSelector, get('dishes'));

export {
    getOneRestaurantAC,
    oneRestaurantSelector,
    oneRestaurantErrorSelector,
    isFetchingOneRestaurantSelector,
};