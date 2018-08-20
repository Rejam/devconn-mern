import { LOGIN, LOGOUT } from "../actions";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { isAuthenticated: true, user: action.payload };
    case LOGOUT:
      return {
        isAuthenticated: false,
        user: {}
      };
    default:
      return state;
  }
};
