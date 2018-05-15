/* eslint-disable import/no-named-as-default */
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Notifs } from 'redux-notifications';
import { Switch, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import LoginPage from './modules/login';
import NavBar from './modules/shared/components/NavBar';
import NotFoundPage from './modules/404';
import OrderPage from './modules/order';
import RestaurantPage from './modules/restaurant';

import {
  isAuthenticatedSelector,
  loginUserSelector,
  requestValidate,
  requestLogout,
  loginTokenSelector,
} from '../components/modules/login/state';
import SideBar from './modules/shared/components/SideBar';
import ConfirmModal from './modules/shared/components/ConfirmModal';
import {
  isOpenConfirmLogoutModalSelector,
  setIsOpenConfirmLogoutModal,
} from './modules/shared/state';

const modalButtonGroup = (logout, openConfirmLogoutModal) => [
  {
    label: 'Log out',
    onClick: () => {
      logout();
      openConfirmLogoutModal(false);
    },
  },
  {
    label: 'Back',
    onClick: () => openConfirmLogoutModal(false),
  },
];

const modalMessage = <p>You sure you want to log out?</p>;

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class App extends React.Component {
  render() {
    const {
      isAuthenticated,
      isOpenConfirmLogoutModal,
      logout,
      openConfirmLogoutModal,
      userData,
      loginToken,
    } = this.props;

    return (
      <div className="velonic-theme">
        <Notifs className="notification-container" />
        {isAuthenticated &&
          userData &&
          loginToken && (
            <div>
              <div id="main-container" className="container-fluid">
                <ConfirmModal
                  isOpen={isOpenConfirmLogoutModal}
                  title="Confirm Logout"
                  buttonGroup={modalButtonGroup(logout, openConfirmLogoutModal)}
                  message={modalMessage}
                  onRequestClose={() => openConfirmLogoutModal(false)}
                />
                <SideBar />
                <NavBar />
                <Switch>
                  <Route exact path="/" component={OrderPage} />
                  <Route path="/order" component={OrderPage} />
                  <Route path="/restaurant" component={RestaurantPage} />
                  <Route component={NotFoundPage} />
                </Switch>
              </div>
            </div>
          )}
        {!isAuthenticated && <LoginPage />}
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isOpenConfirmLogoutModal: PropTypes.bool,
  logout: PropTypes.func,
  loginToken: PropTypes.string.isRequired,
  openConfirmLogoutModal: PropTypes.func,
  userData: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: isAuthenticatedSelector(state),
  userData: loginUserSelector(state),
  loginToken: loginTokenSelector(state),
  isOpenConfirmLogoutModal: isOpenConfirmLogoutModalSelector(state),
});

const mapDispatchToProps = dispatch => ({
  validateToken: userData => dispatch(requestValidate(userData)),
  openConfirmLogoutModal: status =>
    dispatch(setIsOpenConfirmLogoutModal(status)),
  logout: () => dispatch(requestLogout()),
});

const lifeCycleHOC = lifecycle({
  componentWillMount() {
    this.props.validateToken(this.props.userData);
  },
});
const connectToStore = connect(mapStateToProps, mapDispatchToProps);
const enhance = compose(connectToStore, lifeCycleHOC);

export default withRouter(enhance(App));
