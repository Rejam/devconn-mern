import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../actions/authActions";

const Navbar = props => (
  <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
    <div className="container">
      <Link to="/" className="navbar-brand">
        DevConnector
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#mobile-nav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/profiles" className="nav-link">
              Developers
            </Link>
          </li>
        </ul>

        {!props.isAuthenticated ? (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                Sign Up
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                {props.user.name}
              </Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={props.logout}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  </nav>
);

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
