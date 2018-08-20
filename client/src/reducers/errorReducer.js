import { LOG_ERRORS, CLEAR_ERRORS } from "../actions";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_ERRORS:
      return action.payload;
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
};
