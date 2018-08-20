import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // Apply token to all requests
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
