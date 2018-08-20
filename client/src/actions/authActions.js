import axios from "axios";
import { GET_ERRORS } from "./";

// Register user
export const register = userData => dispatch => {
  return axios
    .post("api/auth/register", userData)
    .then(res => {
      console.log(res);
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
