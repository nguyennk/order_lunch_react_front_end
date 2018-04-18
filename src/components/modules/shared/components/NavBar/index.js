import React from 'react';
import { NavLink } from 'react-router-dom';
import EHLogo from '../../../../../assets/images/eh-logo.png';

const NavBar = () =>
    <nav id="app-nav-container" className="navbar navbar-default">
        <div id="app-nav-bar" className="container-fluid">
            <div className="navbar-header">
                <img id="eh-logo" alt="eh-logo" role="presentation" src={EHLogo} />
            </div>
            <ul className="nav">
                <li><NavLink exact to="/" activeClassName={"active"}>Order</NavLink></li>
                <li><NavLink to="/restaurant" activeClassName={"active"}>Restaurant</NavLink></li>
                <li><NavLink to="/feedback" activeClassName={"active"}>Feedback</NavLink></li>
                <li><NavLink to="/account" activeClassName={"active"}>Account</NavLink></li>
            </ul>
        </div >
    </nav>

export default NavBar;