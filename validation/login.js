const Joi = require("joi");

const loginSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .min(6)
      .max(30)
      .required()
  })
  .required();

const options = {
  abortEarly: false
};

module.exports = function validateLoginData(data) {
  const { error } = Joi.validate(data, loginSchema, options);

  // create object of propname: error_message for each error
  const errors = error
    ? error.details.reduce((obj, err) => {
        return { ...obj, [err.context.key]: err.message };
      }, {})
    : {};
  const isValid = error === null;
  return { errors, isValid };
};
