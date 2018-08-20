import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { register } from "../../actions/authActions";

class Register extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const { name, email, password, password2 } = e.target.elements;
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      password2: password2.value
    };
    this.props.register(newUser, this.props.history);
  };

  render() {
    const { errors } = this.props;
    return (
      <div className="register container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">Create your DevConnector account</p>
            <form
              noValidate
              className="needs-validation"
              onSubmit={this.handleSubmit}
            >
              <div className="form-group">
                <input
                  type="text"
                  className={`form-control form-control-lg ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  placeholder="Name"
                  name="name"
                />
                <div className="invalid-feedback">{errors.name}</div>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className={`form-control form-control-lg ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  placeholder="Email Address"
                  name="email"
                />
                <div className="invalid-feedback">{errors.email}</div>
                <small className="form-text text-muted">
                  This site uses Gravatar. For a profile image, use a Gravatar
                  email
                </small>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className={`form-control form-control-lg ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Password"
                  name="password"
                />
                <div className="invalid-feedback">{errors.password}</div>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className={`form-control form-control-lg ${
                    errors.password2 ? "is-invalid" : ""
                  }`}
                  placeholder="Confirm Password"
                  name="password2"
                />
                <div className="invalid-feedback">{errors.password2}</div>
              </div>
              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { register }
)(withRouter(Register));
