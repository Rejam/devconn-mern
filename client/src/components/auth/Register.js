import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    password2: "",
    errors: {}
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const newUser = { ...this.state };
    axios
      .post("api/auth/register", newUser)
      .then(res => res)
      .catch(err => this.setState({ errors: err.response.data }));
  };

  render() {
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
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                    {this.state.errors.name && (
                      <p className="text-danger">{this.state.errors.name}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="Email Address"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                    {this.state.errors.email && (
                      <p className="text-danger">{this.state.errors.email}</p>
                    )}
                    <small className="form-text text-muted">
                      This site uses Gravatar so if you want a profile image,
                      use a Gravatar email
                    </small>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                    {this.state.errors.password && (
                      <p className="text-danger">
                        {this.state.errors.password}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Confirm Password"
                      name="password2"
                      value={this.state.password2}
                      onChange={this.handleChange}
                    />
                    {this.state.errors.password2 && (
                      <p className="text-danger">
                        {this.state.errors.password2}
                      </p>
                    )}
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
