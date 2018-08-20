import React from "react";
import axios from "axios";
import { connect } from "react-redux";

class Login extends React.Component {
  state = {
    credentials: {
      email: "",
      password: ""
    },
    errors: {}
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      credentials: {
        ...this.state.credentials,
        [name]: value
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { credentials } = this.state;
    axios
      .post("api/auth/login", credentials)
      .then(res =>
        this.setState({
          credentials: {
            email: "",
            password: ""
          },
          errors: {}
        })
      )
      .catch(err => this.setState({ errors: err.response.data }));
  };

  render() {
    const { email, password } = this.state.credentials;
    const { errors } = this.state;
    return (
      <div className="container">
        <div className="login">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Log In</h1>
                <p className="lead text-center">
                  Sign in to your DevConnector account
                </p>
                <form noValidate onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      className={`form-control form-control-lg ${errors.email &&
                        "is-invalid"}`}
                      placeholder="Email Address"
                      name="email"
                      value={email}
                      onChange={this.handleChange}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={`form-control form-control-lg ${errors.password &&
                        "is-invalid"}`}
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={this.handleChange}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
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

export default connect()(Login);
