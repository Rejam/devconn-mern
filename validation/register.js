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

module.exports = registerSchema;
