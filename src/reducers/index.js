import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducers as apiReducers } from 'redux-api-call'
import { reducer as formReducer } from 'redux-form';
import { branch as loginBranch } from '../components/modules/login/state';
import { branch as orderBranch } from '../components/modules/order/state';
import { branch as sharedBranch } from '../components/modules/shared/state';

const rootReducer = combineReducers({
  routing: routerReducer,
  form: formReducer,
  ...apiReducers,
  ...loginBranch,
  ...orderBranch,
  ...sharedBranch
});

export default rootReducer;
