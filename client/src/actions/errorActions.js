import { LOG_ERRORS, CLEAR_ERRORS } from "./";

export const clearErrors = errors => ({
  type: CLEAR_ERRORS
});

export const logErrors = errors => ({
  type: LOG_ERRORS,
  payload: errors
});
