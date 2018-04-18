import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { LoginForm } from './components/LoginForm';
import EHLogo from '../../../assets/images/eh-logo.png';

import {
    isFetchingSelector,
    loginErrorSelector,
    requestLogin,
} from './state';

const LoginPage = ({
    requestLogin,
    errorMessage,
    isFetching,
}) =>
    <div id="sign-in-page"
        style={{ marginTop: '30px' }}>
        <img id="eh-logo" alt="eh-logo" role="presentation" src={EHLogo}
            style={{ width: '100%' }} />
        <div id="sign-in-form">
            <h4 className="logo-subtext">Lunch App</h4>
            <LoginForm
                loginHandler={data => requestLogin(data)}
                loginError={errorMessage}
                isFetching={isFetching}
            />
        </div>
    </div>

const mapStateToProps = state => ({
    errorMessage: loginErrorSelector(state),
    isFetching: isFetchingSelector(state)
})

const mapDispatchToProps = dispatch => ({
    requestLogin: data => dispatch(requestLogin(data)),
})

const connectToStore = connect(mapStateToProps, mapDispatchToProps);

const enhance = compose(connectToStore);

export default enhance(LoginPage);