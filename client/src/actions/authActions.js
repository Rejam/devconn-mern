import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { LOGIN, LOGOUT } from "./";
import { logErrors, clearErrors } from "./errorActions";

// Register user
export const register = (userData, history) => dispatch => {
  axios
    .post("api/auth/register", userData)
    .then(res => {
      dispatch(clearErrors());
      history.push("/login");
    })
    .catch(err => dispatch(logErrors(err.response.data)));
};

// Login - get token
export const login = credentials => dispatch => {
  axios
    .post("api/auth/login", credentials)
    .then(res => {
      const { token } = res.data;
      // save token to local storage
      localStorage.setItem("jwtToken", token);
      // Set the token in request headers
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set user
      dispatch(setCurrentUser(decoded));
      dispatch(clearErrors());
    })
    .catch(err => dispatch(logErrors(err.response.data)));
};

const setCurrentUser = userData => ({
  type: LOGIN,
  payload: userData
});

// Log out
export const logout = () => dispatch => {
  localStorage.removeItem("jwtToken");
  setAuthToken();
  dispatch({
    type: LOGOUT
  });
};
