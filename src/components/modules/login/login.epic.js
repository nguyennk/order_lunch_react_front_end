import { combineEpics } from 'redux-observable';
import { setLoginErrorEpic } from './components/epic';

export default combineEpics(setLoginErrorEpic);
