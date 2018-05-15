import flow from 'lodash/fp/flow';
import eq from 'lodash/fp/eq';
import get from 'lodash/fp/get';
import { notifSend } from 'redux-notifications/lib/actions';

const isSetError = flow(get('payload.name'), eq('Error'));
const setLoginErrorOnLoad = ({ payload }) => dispatch => {
  dispatch(notifSend({
    message: payload.message,
    kind: 'danger',
    dismissAfter: 2000,
  }));
};
export const setLoginErrorEpic = action$ =>
  action$
    .ofType('LOGIN/SET_error')
    .filter(isSetError)
    .map(setLoginErrorOnLoad);
