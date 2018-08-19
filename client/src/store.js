import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const root = () => {};
const middleware = applyMiddleware(thunk);

const configureStore = () => {
  return createStore(root, middleware);
};

export default configureStore;
