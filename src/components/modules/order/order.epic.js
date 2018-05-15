import { combineEpics } from 'redux-observable';
import {
  setInitialOrderEpic,
  setInitialRestaurantEpic,
  setInitialTagEpic,
  // setSubmitOrderEpic,
} from './components/epic';

export default combineEpics(
  setInitialOrderEpic,
  setInitialRestaurantEpic,
  setInitialTagEpic,
  // setSubmitOrderEpic
);
