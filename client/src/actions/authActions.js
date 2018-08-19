import Register from "../components/auth/Register";

const authActions = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER"
};

// Register user
export const registerUser = userData => ({
  type: authActions.REGISTER,
  payload: userData
});

export default authActions;
