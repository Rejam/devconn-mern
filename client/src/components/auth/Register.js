import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { register } from "../../actions/authActions";

const Register = props => {
  const handleSubmit = e => {
    e.preventDefault();
    const { name, email, password, password2 } = e.target.elements;
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      password2: password2.value
    };
    props.register(newUser, props.history);
  };

  const Input = props => (
    <div className="form-group">
      <input
        type={props.type}
        className={`form-control form-control-lg ${
          errors[props.name] ? "is-invalid" : ""
        }`}
        placeholder={props.placeholder}
        name={props.name}
      />
      {props.children}
      <div className="invalid-feedback">{errors[props.name]}</div>
    </div>
  );

  const { errors } = props;
  return (
    <div className="register container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Sign Up</h1>
          <p className="lead text-center">Create your DevConnector account</p>
          <form noValidate className="needs-validation" onSubmit={handleSubmit}>
            <Input type="text" name="name" placeholder="Name" />
            <Input type="email" name="email" placeholder="Email address">
              <small className="form-text text-muted">
                This site uses Gravatar. For a profile image, use a Gravatar
                email
              </small>
            </Input>
            <Input type="password" name="password" placeholder="Password" />
            <Input
              type="password"
              name="password2"
              placeholder="Confirm Password"
            />
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  );
};

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
