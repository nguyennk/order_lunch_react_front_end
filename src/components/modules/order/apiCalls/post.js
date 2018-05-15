import { makeFetchAction } from 'redux-api-call';
import { Authorized } from '../../shared/request_helper';
import * as config from '../../../../constants/serverRoutes';

export const SUBMIT_ORDER = 'SUBMIT_ORDER';
const orderEndPointSelector = () =>
  `http://${config.api.root}:${config.api.port}/api/orders`;

const {
  actionCreator: submitOrderAC,
  dataSelector: submitOrderSelector,
  errorSelector: submitOrderErrorSelector,
  isFetchingSelector: isSubmittingOrderSelector,
} = makeFetchAction(SUBMIT_ORDER, (token, data) => ({
  method: 'POST',
  endpoint: orderEndPointSelector(),
  headers: Authorized(token),
  body: JSON.stringify(data),
  notify: {
    success: 'Order Submited',
  },
}));

export {
  submitOrderAC,
  submitOrderSelector,
  submitOrderErrorSelector,
  isSubmittingOrderSelector,
};
