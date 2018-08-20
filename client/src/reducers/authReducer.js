import { REGISTER } from "../actions";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER:
      return { ...state, user: action.payload };
    default:
      return state;
  }
};
