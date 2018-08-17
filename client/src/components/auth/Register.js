import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
  state = {
    user: {
      name: "",
      email: "",
      password: "",
      password2: ""
    },
    errors: {}
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ user: { ...this.state.user, [name]: value } });
  };

  handleSubmit = e => {
    e.preventDefault();
    const newUser = { ...this.state.user };
    axios
      .post("api/auth/register", newUser)
      .then(res => res)
      .catch(err => this.setState({ errors: err.response.data }));
  };

  render() {
    const { errors, user } = this.state;
    return (
      <div className="container">
        <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Sign Up</h1>
                <p className="lead text-center">
                  Create your DevConnector account
                </p>
                <form
                  noValidate
                  className="needs-validation"
                  onSubmit={this.handleSubmit}
                >
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control form-control-lg
                        ${errors.name && "is-invalid"}`}
                      placeholder="Name"
                      name="name"
                      value={user.name}
                      onChange={this.handleChange}
                    />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className={`form-control form-control-lg
                    ${errors.email && "is-invalid"}`}
                      placeholder="Email Address"
                      name="email"
                      value={user.email}
                      onChange={this.handleChange}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                    <small className="form-text text-muted">
                      This site uses Gravatar so if you want a profile image,
                      use a Gravatar email
                    </small>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={`form-control form-control-lg
                      ${errors.password && "is-invalid"}`}
                      placeholder="Password"
                      name="password"
                      value={user.password}
                      onChange={this.handleChange}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={`form-control form-control-lg ${this.state
                        .errors.password2 && "is-invalid"}`}
                      placeholder="Confirm Password"
                      name="password2"
                      value={user.password2}
                      onChange={this.handleChange}
                    />
                    <div className="invalid-feedback">{errors.password2}</div>
                  </div>
                  <input
                    type="submit"
                    className="btn btn-info btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
