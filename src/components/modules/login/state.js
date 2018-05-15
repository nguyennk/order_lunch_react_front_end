import makeStateAction from 'redux-state-action';
import axios from 'axios';
import * as config from '../../../constants/serverRoutes';
import { Authorized } from '../shared/request_helper';

const loginEndPointSelector = () =>
  `http://${config.api.root}:${config.api.port}/api/auth/login`;
const token_name = 'id_token';

export const reducerPath = 'LOGIN';
export const names = {
  is_fetching: 'boolean',
  is_authenticated: 'boolean',
  token: 'string',
  user: {
    type: 'object',
    defaultValue: {},
  },
  error: {
    type: 'object',
    defaultValue: {},
  },
};

export const {
  branch,
  reducer,
  actionTypeFactory,
  actionCreatorFactory,
  selectorFactory,
} = makeStateAction({
  reducerPath,
  names,
});

export const isFetchingSelector = selectorFactory('is_fetching');
export const isAuthenticatedSelector = selectorFactory('is_authenticated');
export const loginUserSelector = selectorFactory('user');
export const loginTokenSelector = selectorFactory('token');
export const loginErrorSelector = selectorFactory('error');

const setIsFetchingAC = actionCreatorFactory('is_fetching');
const setIsAuthenticatedAC = actionCreatorFactory('is_authenticated');
const setLoginTokenAC = actionCreatorFactory('token');
const setLoginUserAC = actionCreatorFactory('user');
const setLoginErrorAC = actionCreatorFactory('error');

export const setUserLogin = loginObj => dispatch => {
  dispatch(setIsFetchingAC(loginObj.isFetching));
  dispatch(setIsAuthenticatedAC(loginObj.isAuthenticated));
  dispatch(setLoginTokenAC(loginObj.token));
  dispatch(setLoginUserAC(loginObj.data));
  dispatch(setLoginErrorAC(loginObj.error));
};

const generateLoginObj = (isFetching, isAuthenticated, token, data, error) => ({
  isFetching,
  isAuthenticated,
  token,
  data,
  error,
});

export const requestLogin = creds => dispatch => {
  dispatch(setUserLogin(generateLoginObj(true, false)));
  axios
    .post(loginEndPointSelector(), creds)
    .then(response => {
      localStorage.setItem(token_name, response.data.jwt_token);
      dispatch(setUserLogin(generateLoginObj(false, true, response.data.jwt_token, response.data)));
    })
    .catch(err => {
      dispatch(setUserLogin(generateLoginObj(
        false,
        false,
        undefined,
        undefined,
        err.response.data
      )));
    });
};

export function requestLogout() {
  return dispatch => {
    localStorage.removeItem(token_name);
    dispatch(setUserLogin(generateLoginObj(false, false)));
  };
}

export function requestValidate(userData) {
  let id_token = userData.jwt_token;
  if (!id_token) id_token = localStorage.getItem(token_name);
  if (id_token) {
    return dispatch => {
      axios
        .get(loginEndPointSelector(), {
          headers: Authorized(id_token),
        })
        .then(() => {
          dispatch(setUserLogin(generateLoginObj(false, true, id_token)));
        })
        .catch(() => {
          dispatch(requestLogout());
        });
    };
  }
  return {};
}
