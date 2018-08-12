const Validator = require("validator");

module.exports = function validateLoginInput(data) {
  const { email, password } = data;
  const errors = {};

  // Validate email
  if (!Validator.isEmail(email)) {
    errors.email = "Should be an email address";
  }

  // Validate password
  if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 and 30 characters.";
  }

  return {
    errors,
    isValid: !Object.keys(errors).length
  };
};
