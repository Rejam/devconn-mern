import { authActions } from "../actions";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authActions.REGISTER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
