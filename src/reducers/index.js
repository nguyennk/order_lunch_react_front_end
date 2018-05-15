import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as notifReducer } from 'redux-notifications';
import { reducers as apiReducers } from 'redux-api-call';
import { reducer as formReducer } from 'redux-form';
import { reducer as burgerMenu } from 'redux-burger-menu';
import { branch as loginBranch } from '../components/modules/login/state';
import { branch as orderBranch } from '../components/modules/order/state';
import { branch as sharedBranch } from '../components/modules/shared/state';

const appReducer = combineReducers({
  routing: routerReducer,
  form: formReducer,
  notifs: notifReducer,
  burgerMenu,
  ...apiReducers,
  ...loginBranch,
  ...orderBranch,
  ...sharedBranch,
});

const rootReducer = (state, action) => {
  const { type, payload } = action;
  if (type === 'LOGIN/SET_is_authenticated') {
    if (!payload) state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
