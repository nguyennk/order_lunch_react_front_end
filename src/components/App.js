/* eslint-disable import/no-named-as-default */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import LoginPage from './modules/login';
import OrderPage from './modules/order';
import RestaurantPage from './modules/restaurant';
import NavBar from './modules/shared/components/NavBar';
import NotFoundPage from './modules/404';

import {
  isAuthenticatedSelector,
  loginUserSelector,
  requestValidate
} from '../components/modules/login/state';

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class App extends React.Component {
  render() {
    const { isAuthenticated, userData } = this.props;

    return (
      <div className='velonic-theme'>
        {isAuthenticated && userData &&
          <div>
            <NavBar />
            <div id="main-container" className="container-fluid">
              <Switch>
                <Route exact path="/" component={OrderPage} />
                <Route path="/order" component={OrderPage} />
                <Route path="/restaurant" component={RestaurantPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </div>
          </div>
        }
        {!isAuthenticated &&
          <LoginPage />
        }
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  userData: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: isAuthenticatedSelector(state),
  userData: loginUserSelector(state),
})

const mapDispatchToProps = dispatch => ({
  validateToken: userData => dispatch(requestValidate(userData)),
})

const lifeCycleHOC = lifecycle({
  componentWillMount() {
    this.props.validateToken(this.props.userData);
  },
});
const connectToStore = connect(mapStateToProps, mapDispatchToProps);
const enhance = compose(connectToStore, lifeCycleHOC);

export default withRouter(enhance(App));
