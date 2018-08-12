const Joi = require("joi");

const registerSchema = Joi.object()
  .keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .alphanum()
      .min(6)
      .max(30),
    password2: Joi.any().valid(Joi.ref("password"))
  })
  .required();

const options = {
  abortEarly: false
};
module.exports = function validateRegisterData(data) {
  const { error } = Joi.validate(data, registerSchema, options);

  // create object of propname: error_message for each error
  const errors = error
    ? error.details.reduce((obj, err) => {
        return { ...obj, [err.context.key]: err.message };
      }, {})
    : {};
  const isValid = error === null;
  return { errors, isValid };
};

// const Validator = require("validator");

// module.exports = function validateRegisterInput(data) {
//   const { name, email, password, password2 } = data;
//   const errors = {};

//   // Validate name
//   if (!Validator.isLength(name, { min: 2, max: 30 })) {
//     errors.name = "Name must be between 2 and 30 characters";
//   }
//   // Validate email
//   if (!Validator.isEmail(email)) {
//     errors.email = "Should be an email address";
//   }
//   // Validate password and password confirmation
//   if (!Validator.isLength(password, { min: 6, max: 30 })) {
//     errors.password = "Password must be between 6 and 30 characters";
//   }
//   if (!Validator.isLength(password2, { min: 6, max: 30 })) {
//     errors.password2 =
//       "Password confirmation must be between 6 and 30 characters";
//   }
//   if (!Validator.equals(password, password2)) {
//     errors.password = "Passwords must match";
//   }

//   return {
//     errors,
//     isValid: !Object.keys(errors).length
//   };
// };
