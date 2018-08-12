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

module.exports = loginSchema;
