const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .label("Must be a valid email address")
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .label("Password should be between 6 and 30 characters")
    .required()
}).required();

module.exports = loginSchema;
