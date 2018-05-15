import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { action as toggleMenu } from 'redux-burger-menu';
import Menu from './ConnectedMenu';
import { setIsOpenConfirmLogoutModal } from '../../state';

const SideBar = ({ openConfirmLogoutModal, openSideBar }) => (
  <Menu right itemListClassName="sidebar-menu-item">
    <NavLink
      to="/account"
      activeClassName="active"
      onClick={() => openSideBar(false)}
    >
      Account
    </NavLink>
    <NavLink
      to="/feedback"
      activeClassName="active"
      onClick={() => openSideBar(false)}
    >
      Feedback
    </NavLink>
    <a
      id="logout_side_btn"
      href="#"
      onClick={() => {
        openConfirmLogoutModal();
        openSideBar(false);
      }}
    >
      Logout
    </a>
  </Menu>
);

const mapDispatchToProps = dispatch => ({
  openSideBar: status => dispatch(toggleMenu(status)),
  openConfirmLogoutModal: () => dispatch(setIsOpenConfirmLogoutModal(true)),
});

const connectToStore = connect(undefined, mapDispatchToProps);

const enhance = compose(connectToStore);

export default enhance(SideBar);
