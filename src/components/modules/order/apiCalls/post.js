import { makeFetchAction } from 'redux-api-call';
import * as config from '../../../../constants/serverRoutes';

export const LOGIN_USER = 'LOGIN_USER';
const loginEndPointSelector = () => {
    return `http://${config.api.root}:${config.api.port}/api/auth/login`;
}

const {
    actionCreator: loginUserAC,
    dataSelector: loginUserSelector,
    errorSelector: loginUserErrorSelector,
    isFetchingSelector: isFetchingLoginUserSelector,
} = makeFetchAction(
    LOGIN_USER,
    data => ({
        method: 'POST',
        endpoint: loginEndPointSelector(),
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
);

export {
    loginUserAC,
    loginUserSelector,
    loginUserErrorSelector,
    isFetchingLoginUserSelector,
};