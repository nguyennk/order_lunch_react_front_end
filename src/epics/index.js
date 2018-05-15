import { combineEpics } from 'redux-observable';
import loginEpic from '../components/modules/login/login.epic';
import orderEpic from '../components/modules/order/order.epic';

export const rootEpic = combineEpics(loginEpic, orderEpic);
