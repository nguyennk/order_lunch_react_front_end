import { makeFetchAction } from 'redux-api-call';
import * as config from '../../../../constants/serverRoutes';
import { Authorized } from '../../shared/request_helper';

export const GET_ORDER = 'GET_ORDER';
const orderEndPointSelector = () =>
  `http://${config.api.root}:${config.api.port}/api/orders`;

export const {
  actionCreator: getTodayOrderAC,
  dataSelector: todayOrderSelector,
  errorSelector: todayOrderErrorSelector,
  isFetchingSelector: isFetchingTodayOrderSelector,
} = makeFetchAction(GET_ORDER, token => ({
  method: 'GET',
  endpoint: orderEndPointSelector(),
  headers: Authorized(token),
}));
