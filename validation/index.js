const Joi = require("joi");

const options = {
  abortEarly: false
};

module.exports = function validate(data, schema) {
  const { error } = Joi.validate(data, schema, options);

  // create object of propname: error_message for each error
  const errors = error
    ? error.details.reduce((obj, err) => {
        return { ...obj, [err.context.key]: err.message };
      }, {})
    : {};
  const isValid = error === null;
  return { errors, isValid };
};
